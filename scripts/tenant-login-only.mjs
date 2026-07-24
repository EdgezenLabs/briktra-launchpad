/**
 * Tenant-only login test (NO register).
 * Tries the passwords the user shared for Tenant.
 */
const BASE = 'https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa';
const email = 'tenant@yopmail.com';
const passwords = ['Tenant@123Manager', 'Tenant@123'];

async function login(password) {
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

const results = [];
for (const password of passwords) {
  const r = await login(password);
  console.log(`LOGIN ${email} password=${JSON.stringify(password)} => ${r.status} ${r.text.slice(0, 200)}`);
  results.push({ password, ...r });
  if (r.ok) {
    const tokens = JSON.parse(r.text);
    const me = await fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${tokens.access_token}`, Accept: 'application/json' },
    });
    console.log('ME', me.status, (await me.text()).slice(0, 800));
    process.exit(0);
  }
}
console.log('ALL TENANT LOGIN ATTEMPTS FAILED');
process.exit(2);
