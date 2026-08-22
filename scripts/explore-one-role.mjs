/**
 * Explore ONE role deeply against QA API.
 * Usage: node scripts/explore-one-role.mjs Tenant
 *
 * Login matches Flutter client: GET /auth/login/hint â†’ PBKDF2 hash â†’ POST /auth/login
 */
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

const BASE = process.env.BRIKTRA_API_BASE || '';
const OUT = path.join(__dirname, '..', 'docs', 'role-exploration');
const SALT_GUID = process.env.BRIKTRA_SALT_GUID || '';

const ACCOUNTS = {
  Tenant: {
    email: process.env.TENANT_EMAIL || process.env.BRIKTRA_TENANT_EMAIL || process.env.BRIKTRA_EMAIL || '',
    password: process.env.TENANT_PASSWORD || process.env.BRIKTRA_TENANT_PASSWORD || process.env.BRIKTRA_PASSWORD || '',
  },
  Manager: {
    email: process.env.MANAGER_EMAIL || process.env.BRIKTRA_MANAGER_EMAIL || '',
    password: process.env.MANAGER_PASSWORD || process.env.BRIKTRA_MANAGER_PASSWORD || '',
  },
  Supervisor: {
    email: process.env.SUPERVISOR_EMAIL || process.env.BRIKTRA_SUPERVISOR_EMAIL || '',
    password: process.env.SUPERVISOR_PASSWORD || process.env.BRIKTRA_SUPERVISOR_PASSWORD || '',
  },
  Employee: {
    email: process.env.EMPLOYEE_EMAIL || process.env.BRIKTRA_EMPLOYEE_EMAIL || '',
    password: process.env.EMPLOYEE_PASSWORD || process.env.BRIKTRA_EMPLOYEE_PASSWORD || '',
  },
};

function hashPassword(identifier, password) {
  const salt = crypto.createHash('sha256').update(identifier + SALT_GUID, 'utf8').digest();
  const derived = crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), salt, 10000, 32, 'sha256');
  return derived.toString('base64');
}

async function resolveIdentifier(username) {
  const hint = await api('GET', '/auth/login/hint', { query: { username } });
  if (hint.ok) {
    try {
      const obj = JSON.parse(hint.body);
      if (obj.hash_identifier) return String(obj.hash_identifier);
    } catch {}
  }
  return username.includes('@') ? username : username;
}

const roleArg = process.argv[2] || 'Tenant';
const account = ACCOUNTS[roleArg];
if (!account) {
  console.error('Usage: node scripts/explore-one-role.mjs <Tenant|Manager|Supervisor|Employee>');
  process.exit(1);
}

function redact(s) {
  if (!s) return s;
  return String(s)
    .replace(/("access_token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"')
    .replace(/("refresh_token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"')
    .replace(/("id_token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"')
    .replace(/("token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"');
}

function decodeJwt(jwt) {
  try {
    const p = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = p + '='.repeat((4 - (p.length % 4)) % 4);
    return Buffer.from(pad, 'base64').toString('utf8');
  } catch {
    return null;
  }
}

function pretty(obj) {
  try {
    return JSON.stringify(typeof obj === 'string' ? JSON.parse(obj) : obj, null, 2);
  } catch {
    return String(obj);
  }
}

async function api(method, apiPath, { body, token, query } = {}) {
  const url = new URL(`${BASE}${apiPath}`);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-Platform': 'flutter',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text, ok: res.ok };
}

function pickDeep(obj, keys) {
  if (!obj || typeof obj !== 'object') return null;
  for (const k of keys) {
    if (obj[k] != null) return obj[k];
  }
  for (const v of Object.values(obj)) {
    if (v && typeof v === 'object') {
      const found = pickDeep(v, keys);
      if (found != null) return found;
    }
  }
  return null;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const lines = [];
  const add = (...xs) => lines.push(...xs);

  console.log(`\n===== ${roleArg}: ${account.email} =====`);
  add(`# Live Exploration: ${roleArg}`);
  add(`Email: ${account.email}`);
  add(`Timestamp: ${new Date().toISOString()}`);
  add(`API: ${BASE}`);
  add(`Local app: http://localhost:4173/app/`);
  add('');

  const identifier = await resolveIdentifier(account.email);
  add(`hash_identifier: ${identifier}`, '');
  console.log('hash_identifier:', identifier);

  // Wrong password (hashed with correct identifier â€” still wrong secret)
  const badHash = hashPassword(identifier, 'WrongPass@999');
  const bad = await api('POST', '/auth/login', {
    body: { username: account.email, password: badHash },
  });
  add('## Incorrect password', `Status: ${bad.status}`, '```json', redact(bad.body), '```', '');
  console.log('Wrong password:', bad.status);

  // Login with client-side PBKDF2 hash (matches Flutter)
  const hashed = hashPassword(identifier, account.password);
  const login = await api('POST', '/auth/login', {
    body: { username: account.email, password: hashed },
  });
  add('## Login (hashed)', `Status: ${login.status}`, '```json', redact(pretty(login.body)), '```', '');
  console.log('Login:', login.status, login.body.slice(0, 200));

  if (!login.ok) {
    fs.writeFileSync(path.join(OUT, `${roleArg}-live.md`), lines.join('\n'));
    console.error('LOGIN FAILED â€” stopping this role');
    process.exitCode = 2;
    return;
  }

  const loginObj = JSON.parse(login.body);
  const token = loginObj.access_token;
  const refresh = loginObj.refresh_token;
  const claims = decodeJwt(token);
  add('## JWT claims (unverified)', '```json', redact(pretty(claims)), '```', '');

  const me = await api('GET', '/auth/me', { token });
  add('## GET /auth/me', `Status: ${me.status}`, '```json', redact(pretty(me.body)), '```', '');
  console.log('Me:', me.status);

  let meObj = {};
  try { meObj = JSON.parse(me.body); } catch {}
  const tenantId = pickDeep(meObj, ['tenant_id', 'tenantId']);
  const userId = pickDeep(meObj, ['user_id', 'id', 'sub']);
  const role = pickDeep(meObj, ['role', 'user_role', 'role_name']);
  add(`Detected tenant_id: ${tenantId}`);
  add(`Detected user_id: ${userId}`);
  add(`Detected role: ${role}`);
  add('');

  const probes = [
    ['GET', '/projects'],
    ['GET', '/users'],
    ['GET', '/employees'],
    ['GET', '/tenants'],
    ['GET', '/suppliers'],
    ['GET', '/contractors'],
    ['GET', '/notifications'],
    ['GET', '/users/profile'],
    ['GET', '/tenants/my-referral-code'],
    ['GET', '/bills'],
    ['GET', '/expenses'],
    ['GET', '/attendance'],
    ['GET', '/payroll'],
    ['GET', '/stock'],
    ['GET', '/subscriptions'],
    ['GET', '/plans'],
  ];
  if (tenantId) {
    probes.push(['GET', `/tenants/${tenantId}`]);
    probes.push(['GET', `/tenants/${tenantId}/project-settings`]);
  }
  if (userId) {
    probes.push(['GET', `/users/${userId}`]);
    probes.push(['GET', `/users/${userId}/wages`]);
  }

  add('## Endpoint probe matrix', '| Method | Path | Status | Body preview |', '|--------|------|--------|--------------|');
  let projectId = null;
  let employeeId = null;
  for (const [method, p] of probes) {
    const r = await api(method, p, { token });
    const preview = (r.body || '').slice(0, 160).replace(/\n/g, ' ').replace(/\|/g, '/');
    add(`| ${method} | \`${p}\` | ${r.status} | ${preview} |`);
    console.log(`  ${method} ${p} -> ${r.status}`);
    if (p === '/projects' && r.ok) {
      try {
        const pj = JSON.parse(r.body);
        const arr = Array.isArray(pj) ? pj : pj.data || pj.projects || pj.items || [];
        if (Array.isArray(arr) && arr[0]) projectId = arr[0].id || arr[0].project_id;
      } catch {}
    }
    if ((p === '/users' || p === '/employees') && r.ok && !employeeId) {
      try {
        const uj = JSON.parse(r.body);
        const arr = Array.isArray(uj) ? uj : uj.data || uj.users || uj.employees || uj.items || [];
        if (Array.isArray(arr) && arr[0]) employeeId = arr[0].id || arr[0].user_id;
      } catch {}
    }
  }
  add('');

  if (projectId) {
    add(`## Project-scoped probes (project_id=${projectId})`);
    add('| Method | Path | Status | Preview |', '|--------|------|--------|---------|');
    for (const p of [
      `/projects/${projectId}`,
      `/users/project/${projectId}/employees`,
      `/projects/${projectId}/sub-projects`,
      `/attendance/project/${projectId}`,
      `/expenses/project/${projectId}`,
      `/daily-uploads/project/${projectId}`,
      `/reports/project/${projectId}`,
      `/bills/project/${projectId}`,
      `/stock/project/${projectId}`,
    ]) {
      const r = await api('GET', p, { token });
      const preview = (r.body || '').slice(0, 120).replace(/\n/g, ' ').replace(/\|/g, '/');
      add(`| GET | \`${p}\` | ${r.status} | ${preview} |`);
      console.log(`  GET ${p} -> ${r.status}`);
    }
    add('');
  }

  // Privilege escalation attempts (safe GETs + one sensitive)
  add('## Privilege / negative probes');
  add('| Method | Path | Status | Preview |', '|--------|------|--------|---------|');
  const negatives = [
    ['GET', '/superAdmin'],
    ['GET', '/tenantAdmins'],
    ['POST', '/users/bulk'],
    ['GET', '/tenants/00000000-0000-0000-0000-000000000001'],
  ];
  if (tenantId) negatives.push(['DELETE', `/tenants/${tenantId}`]); // expect deny for non-tenant; don't actually want delete for tenant - skip body
  for (const [method, p] of negatives) {
    // Never actually DELETE tenant - use OPTIONS or skip destructive
    if (method === 'DELETE') {
      add(`| ${method} | \`${p}\` | SKIPPED | Destructive â€” not executed |`);
      continue;
    }
    const r = await api(method, p, {
      token,
      body: method === 'POST' ? { users: [] } : undefined,
    });
    const preview = (r.body || '').slice(0, 120).replace(/\n/g, ' ').replace(/\|/g, '/');
    add(`| ${method} | \`${p}\` | ${r.status} | ${preview} |`);
    console.log(`  ${method} ${p} -> ${r.status}`);
  }
  add('');

  // Refresh
  const ref = await api('POST', '/auth/refresh', { body: { refresh_token: refresh } });
  add('## POST /auth/refresh', `Status: ${ref.status}`, '```json', redact(pretty(ref.body)), '```', '');
  console.log('Refresh:', ref.status);

  let newAccess = token;
  try {
    if (ref.ok) newAccess = JSON.parse(ref.body).access_token || token;
  } catch {}

  // Logout with original refresh
  const lo = await api('POST', '/auth/logout', { body: { refresh_token: refresh }, token: newAccess });
  add('## POST /auth/logout', `Status: ${lo.status}`, '```json', redact(pretty(lo.body)), '```', '');
  console.log('Logout:', lo.status);

  const me2 = await api('GET', '/auth/me', { token: newAccess });
  add('## Post-logout GET /auth/me', `Status: ${me2.status}`, '```json', redact(pretty(me2.body)), '```');
  console.log('Post-logout me:', me2.status);

  const outPath = path.join(OUT, `${roleArg}-live.md`);
  fs.writeFileSync(outPath, lines.join('\n'));
  console.log('Saved', outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
