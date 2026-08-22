import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Load environment variables from .env if present
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(envPath);
  } else {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const BASE_URL = process.env.BRIKTRA_API_BASE || process.env.API_BASE || '';
const SALT_GUID = process.env.BRIKTRA_SALT_GUID || '';

const ACCOUNTS = [
  {
    role: 'tenant_admin',
    email: process.env.TENANT_EMAIL || process.env.BRIKTRA_TENANT_EMAIL || process.env.BRIKTRA_EMAIL || '',
    pass: process.env.TENANT_PASSWORD || process.env.BRIKTRA_TENANT_PASSWORD || process.env.BRIKTRA_PASSWORD || '',
  },
  {
    role: 'manager',
    email: process.env.MANAGER_EMAIL || process.env.BRIKTRA_MANAGER_EMAIL || '',
    pass: process.env.MANAGER_PASSWORD || process.env.BRIKTRA_MANAGER_PASSWORD || '',
  },
  {
    role: 'supervisor',
    email: process.env.SUPERVISOR_EMAIL || process.env.BRIKTRA_SUPERVISOR_EMAIL || '',
    pass: process.env.SUPERVISOR_PASSWORD || process.env.BRIKTRA_SUPERVISOR_PASSWORD || '',
  },
  {
    role: 'employee',
    email: process.env.EMPLOYEE_EMAIL || process.env.BRIKTRA_EMPLOYEE_EMAIL || '',
    pass: process.env.EMPLOYEE_PASSWORD || process.env.BRIKTRA_EMPLOYEE_PASSWORD || '',
  },
];

// Exact same hashing as Flutter client + existing prod regression scripts
function hashPassword(identifier, password) {
  const salt = crypto.createHash('sha256').update(identifier + SALT_GUID, 'utf8').digest();
  return crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), salt, 10000, 32, 'sha256').toString('base64');
}

async function api(method, path, { body, token, query } = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Platform': 'flutter',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const bodyStr = body ? JSON.stringify(body) : undefined;
  const res = await fetch(url, { method, headers, body: bodyStr });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = {}; }
  return { status: res.status, ok: res.ok, json, text };
}

async function loginUser(email, password) {
  try {
    // Step 1: Get hash_identifier
    const hint = await api('GET', '/auth/login/hint', { query: { username: email } });
    const identifier = hint.json.hash_identifier || email;

    // Step 2: Hash password (SHA256(identifier + SALT_GUID) â†’ PBKDF2)
    const hashedPassword = hashPassword(identifier, password);

    // Step 3: Login using username + hashed password (matches prod API contract)
    const loginRes = await api('POST', '/auth/login', {
      body: { username: email, password: hashedPassword },
    });
    if (!loginRes.ok) {
      console.log(`  [login FAIL ${loginRes.status}] ${loginRes.text.slice(0, 200)}`);
      return null;
    }
    return {
      token: loginRes.json.access_token || loginRes.json.token,
      refreshToken: loginRes.json.refresh_token,
      role: loginRes.json.user?.role,
    };
  } catch (e) {
    console.error(`  Login error for ${email}: ${e.message}`);
    return null;
  }
}

async function runRbacTests() {
  console.log('=== BRIKTRA RBAC AUTOMATED REGRESSION MATRIX ===');
  console.log(`Target API: ${BASE_URL}\n`);

  const sessions = {};
  for (const acc of ACCOUNTS) {
    process.stdout.write(`Logging in ${acc.role} (${acc.email})... `);
    const sess = await loginUser(acc.email, acc.pass);
    if (sess && sess.token) {
      sessions[acc.role] = sess.token;
      console.log('âœ… PASS');
    } else {
      console.log('âŒ FAIL');
    }
  }

  const ENDPOINTS = [
    { name: 'Get Profile', method: 'GET', path: '/auth/me', allowedRoles: ['tenant_admin', 'manager', 'supervisor', 'employee'] },
    { name: 'List Tenants', method: 'GET', path: '/tenants', allowedRoles: ['super_admin'] },
    { name: 'Create Tenant', method: 'POST', path: '/tenants', allowedRoles: ['super_admin'] },
    { name: 'List Tenant Admins', method: 'GET', path: '/users/tenant-admins', allowedRoles: ['super_admin', 'tenant_admin'] },
    { name: 'List Projects', method: 'GET', path: '/projects', allowedRoles: ['tenant_admin', 'manager', 'supervisor'] },
    { name: 'Create Project', method: 'POST', path: '/projects', allowedRoles: ['tenant_admin', 'manager'] },
    { name: 'Payroll Summary', method: 'GET', path: '/payroll/summary', allowedRoles: ['tenant_admin', 'manager'] },
  ];

  console.log('\n--- RBAC ENDPOINT ACCESS MATRIX ---');
  const results = [];

  for (const ep of ENDPOINTS) {
    for (const [role, token] of Object.entries(sessions)) {
      try {
        const res = await api(ep.method, ep.path, {
          token,
          body: ep.method === 'POST' ? { _rbac_test: true } : undefined,
        });

        const isAllowed = ep.allowedRoles.includes(role);
        const gotDenied = res.status === 403 || res.status === 401;
        const pass = isAllowed ? !gotDenied : gotDenied;

        results.push({
          Endpoint: ep.name,
          Role: role,
          Expected: isAllowed ? '2xx/400/404' : '401/403',
          ActualStatus: res.status,
          Result: pass ? 'âœ… PASS' : 'âŒ FAIL',
        });
      } catch (err) {
        results.push({
          Endpoint: ep.name,
          Role: role,
          Expected: 'Response',
          ActualStatus: 'ERR',
          Result: 'âš ï¸ ERROR',
        });
      }
    }
  }

  console.table(results);
  const total = results.length;
  const passed = results.filter(r => r.Result.includes('PASS')).length;
  console.log(`\nRBAC Matrix Score: ${passed}/${total} assertions passed (${Math.round(passed/total*100)}%)`);
}

runRbacTests();
