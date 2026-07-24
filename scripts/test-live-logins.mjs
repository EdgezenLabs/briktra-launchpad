/**
 * Test credentials against the live Briktra.com Flutter app API.
 * Run: node scripts/test-live-logins.mjs
 */
const BASE = 'https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa';

const accounts = [
  {
    role: 'Tenant',
    email: 'tenant@yopmail.com',
    passwords: ['Tenant@123Manager', 'Tenant@123'],
  },
  {
    role: 'Manager',
    email: 'briktramanager@yopmail.com',
    passwords: ['Manager@123SuperVisor', 'Manager@123'],
  },
  {
    role: 'Supervisor',
    email: 'briktrasupervisor@yopmail.com',
    passwords: ['Supervisor@123Employee', 'Supervisor@123'],
  },
  {
    role: 'Employee',
    email: 'briktraemployee@yopmail.com',
    passwords: ['Employee@123'],
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
        : `FAIL ${r.role} (${r.email}) — Invalid credentials`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
