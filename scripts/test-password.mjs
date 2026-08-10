import crypto from 'crypto';
// Live Briktra app uses PROD. Override with BRIKTRA_API_BASE for QA.
const BASE =
  process.env.BRIKTRA_API_BASE ||
  'https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod';
const SALT = 'briktra-password-salt-guid-2026';
function hash(id, pw) {
  const salt = crypto.createHash('sha256').update(id + SALT, 'utf8').digest();
  return crypto.pbkdf2Sync(Buffer.from(pw, 'utf8'), salt, 10000, 32, 'sha256').toString('base64');
}
const email = process.argv[2] || 'tenant@yopmail.com';
const pw = process.argv[3] || 'Abcd@123';
console.log('API', BASE);
const hint = await (
  await fetch(`${BASE}/auth/login/hint?username=${encodeURIComponent(email)}`, {
    headers: { 'X-Client-Platform': 'flutter' },
  })
).json();
const r = await fetch(`${BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Client-Platform': 'flutter' },
  body: JSON.stringify({ username: email, password: hash(hint.hash_identifier, pw) }),
});
console.log(pw, r.status, (await r.text()).slice(0, 250));
