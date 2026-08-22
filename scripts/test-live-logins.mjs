/**
 * Test credentials against the live Briktra.com Flutter app API.
 * Run: node scripts/test-live-logins.mjs
 */
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

const accounts = [
  {
    role: 'Tenant',
    email: process.env.TENANT_EMAIL || process.env.BRIKTRA_TENANT_EMAIL || process.env.BRIKTRA_EMAIL || '',
    passwords: [process.env.TENANT_PASSWORD || process.env.BRIKTRA_TENANT_PASSWORD || process.env.BRIKTRA_PASSWORD || ''].filter(Boolean),
  },
  {
    role: 'Manager',
    email: process.env.MANAGER_EMAIL || process.env.BRIKTRA_MANAGER_EMAIL || '',
    passwords: [process.env.MANAGER_PASSWORD || process.env.BRIKTRA_MANAGER_PASSWORD || ''].filter(Boolean),
  },
  {
    role: 'Supervisor',
    email: process.env.SUPERVISOR_EMAIL || process.env.BRIKTRA_SUPERVISOR_EMAIL || '',
    passwords: [process.env.SUPERVISOR_PASSWORD || process.env.BRIKTRA_SUPERVISOR_PASSWORD || ''].filter(Boolean),
  },
  {
    role: 'Employee',
    email: process.env.EMPLOYEE_EMAIL || process.env.BRIKTRA_EMPLOYEE_EMAIL || '',
    passwords: [process.env.EMPLOYEE_PASSWORD || process.env.BRIKTRA_EMPLOYEE_PASSWORD || ''].filter(Boolean),
  },
];

function redact(s) {
  return String(s)
    .replace(/("access_token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"')
    .replace(/("refresh_token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"')
    .replace(/("id_token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"');
}

async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-client-platform': 'web',
    },
    body: JSON.stringify({ username: email, password }),
  });
  const text = await res.text();
  return { status: res.status, ok: res.ok, text };
}

async function main() {
  console.log('Live site: https://briktra.com/');
  console.log('Login entry: https://briktra.com/app/index.html');
  console.log('API (from live Flutter client):', BASE);
  console.log('');

  const results = [];

  for (const a of accounts) {
    console.log(`==== ${a.role}: ${a.email} ====`);
    let success = null;
    for (const password of a.passwords) {
      const r = await login(a.email, password);
      console.log(`  password ${JSON.stringify(password)} => ${r.status} ${redact(r.text).slice(0, 160)}`);
      if (r.ok) {
        success = { password, r };
        break;
      }
    }

    if (!success) {
      results.push({ role: a.role, email: a.email, ok: false, status: 401 });
      console.log('');
      continue;
    }

    const tokens = JSON.parse(success.r.text);
    const meRes = await fetch(`${BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: 'application/json',
      },
    });
    const meText = await meRes.text();
    console.log(`  /auth/me ${meRes.status} ${redact(meText).slice(0, 500)}`);

    await fetch(`${BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens.access_token}`,
      },
      body: JSON.stringify({ refresh_token: tokens.refresh_token }),
    });
    console.log('  logout done');
    results.push({
      role: a.role,
      email: a.email,
      ok: true,
      passwordUsed: success.password,
      meStatus: meRes.status,
    });
    console.log('');
  }

  console.log('==== SUMMARY ====');
  for (const r of results) {
    console.log(
      r.ok
        ? `PASS ${r.role} (${r.email}) password=${JSON.stringify(r.passwordUsed)} me=${r.meStatus}`
        : `FAIL ${r.role} (${r.email}) â€” Invalid credentials`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
