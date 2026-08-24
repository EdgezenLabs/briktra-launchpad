import crypto from 'crypto';

const BASE = process.env.BRIKTRA_API_BASE || '';
const SALT = process.env.BRIKTRA_SALT_GUID || '';

function hash(id, pw) {
  const salt = crypto.createHash('sha256').update(id + SALT, 'utf8').digest();
  return crypto.pbkdf2Sync(Buffer.from(pw, 'utf8'), salt, 10000, 32, 'sha256').toString('base64');
}

const EMAIL = process.env.BRIKTRA_TEST_EMAIL || '';
const hint = await (
  await fetch(BASE + '/auth/login/hint?username=' + encodeURIComponent(email), {
    headers: { 'X-Client-Platform': 'flutter' },
  })
).json();
const hashed = hash(hint.hash_identifier, 'Tenant@123');
const loginRes = await fetch(BASE + '/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Client-Platform': 'flutter' },
  body: JSON.stringify({ username: email, password: hashed }),
});
const login = await loginRes.json();
const token = login.access_token;
console.log('login keys', Object.keys(login));
console.log('role', login.role, 'tenant', login.tenant_id);

const tests = [
  ['Bearer access+flutter', { Authorization: 'Bearer ' + token, 'X-Client-Platform': 'flutter' }],
  ['Bearer access only', { Authorization: 'Bearer ' + token }],
  ['raw access', { Authorization: token, 'X-Client-Platform': 'flutter' }],
  ['id_token', { Authorization: 'Bearer ' + login.id_token, 'X-Client-Platform': 'flutter' }],
  ['web platform', { Authorization: 'Bearer ' + token, 'X-Client-Platform': 'web' }],
];

for (const [label, h] of tests) {
  const r = await fetch(BASE + '/projects', { headers: { ...h, Accept: 'application/json' } });
  const t = await r.text();
  console.log(label, r.status, t.slice(0, 150));
}

const me = await fetch(BASE + '/auth/me', {
  headers: { Authorization: 'Bearer ' + token, 'X-Client-Platform': 'flutter', Accept: 'application/json' },
});
console.log('me', me.status, (await me.text()).slice(0, 100));

// Try common query tenant scoping
for (const path of [
  '/projects?tenant_id=' + login.tenant_id,
  '/users?tenant_id=' + login.tenant_id,
  '/tenants/' + login.tenant_id,
]) {
  const r = await fetch(BASE + path, {
    headers: { Authorization: 'Bearer ' + token, 'X-Client-Platform': 'flutter', Accept: 'application/json' },
  });
  console.log(path, r.status, (await r.text()).slice(0, 120));
}
