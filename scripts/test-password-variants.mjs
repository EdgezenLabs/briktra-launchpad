import crypto from 'crypto';

const BASE = 'https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa';
const SALT = 'briktra-password-salt-guid-2026';
const email = 'tenant@yopmail.com';
const passwords = ['Abcd@123', 'Tenant@123', 'abcd@123', 'ABCD@123'];

function hash(id, pw) {
  const salt = crypto.createHash('sha256').update(id + SALT, 'utf8').digest();
  return crypto.pbkdf2Sync(Buffer.from(pw, 'utf8'), salt, 10000, 32, 'sha256').toString('base64');
}

const hintRes = await fetch(`${BASE}/auth/login/hint?username=${encodeURIComponent(email)}`, {
  headers: { 'X-Client-Platform': 'flutter' },
});
const hintText = await hintRes.text();
console.log('hint', hintRes.status, hintText);

let identifier = email;
try {
  identifier = JSON.parse(hintText).hash_identifier || email;
} catch {}

for (const pw of passwords) {
  for (const id of [identifier, email, email.toLowerCase()]) {
    const r = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Client-Platform': 'flutter' },
      body: JSON.stringify({ username: email, password: hash(id, pw) }),
    });
    const t = await r.text();
    console.log(`pw=${pw} id=${id.slice(0,8)}... => ${r.status} ${t.slice(0, 80)}`);
    if (r.ok) break;
  }
}

// Plaintext attempt
const plain = await fetch(`${BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Client-Platform': 'web' },
  body: JSON.stringify({ username: email, password: 'Abcd@123' }),
});
console.log('plaintext web', plain.status, (await plain.text()).slice(0, 80));
