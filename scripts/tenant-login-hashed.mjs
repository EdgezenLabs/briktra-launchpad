/**
 * Tenant login matching Flutter client hashing.
 * salt = SHA256(utf8(identifier + "briktra-password-salt-guid-2026"))
 * password_hash = base64(PBKDF2-HMAC-SHA256(password, salt, 10000, 32))
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa';
const SALT_GUID = 'briktra-password-salt-guid-2026';
const OUT = path.join(__dirname, '..', 'docs', 'role-exploration');

function hashPassword(identifier, password) {
  const salt = crypto.createHash('sha256').update(identifier + SALT_GUID, 'utf8').digest();
  const derived = crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), salt, 10000, 32, 'sha256');
  return derived.toString('base64');
}

function redact(s) {
  return String(s || '')
    .replace(/("access_token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"')
    .replace(/("refresh_token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"')
    .replace(/("id_token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"');
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
  return { status: res.status, ok: res.ok, text };
}

async function resolveIdentifier(username) {
  // Flutter: GET /auth/login/hint?username=...
  const hint = await api('GET', '/auth/login/hint', { query: { username } });
  console.log('login/hint GET', hint.status, hint.text.slice(0, 200));
  if (hint.ok) {
    try {
      const obj = JSON.parse(hint.text);
      if (obj.hash_identifier) return String(obj.hash_identifier);
    } catch {}
  }
  // Fallback in client when hint fails: use email if contains @
  return username.includes('@') ? username : username;
}

async function loginTenant() {
  const email = 'tenant@yopmail.com';
  const password = 'Tenant@123';
  console.log('UI:', 'https://briktra.com/app/index.html#/login');
  console.log('Account:', email);

  const identifier = await resolveIdentifier(email);
  console.log('hash identifier:', identifier);
  const hashed = hashPassword(identifier, password);
  console.log('hashed password length:', hashed.length, 'sample:', hashed.slice(0, 12) + '...');

  const login = await api('POST', '/auth/login', {
    body: { username: email, password: hashed },
  });
  console.log('LOGIN hashed =>', login.status, redact(login.text).slice(0, 300));

  // Also try plaintext for comparison (should fail)
  const plain = await api('POST', '/auth/login', {
    body: { username: email, password },
  });
  console.log('LOGIN plaintext =>', plain.status, plain.text.slice(0, 120));

  if (!login.ok) {
    // Try hint identifier variants
    for (const id of [email, email.toLowerCase(), email.trim()]) {
      const h = hashPassword(id, password);
      const r = await api('POST', '/auth/login', { body: { username: email, password: h } });
      console.log(`retry id=${id} =>`, r.status, redact(r.text).slice(0, 160));
      if (r.ok) return finish(r, email);
    }
    process.exitCode = 2;
    return null;
  }
  return finish(login, email);
}

async function finish(login, email) {
  const tokens = JSON.parse(login.text);
  const me = await api('GET', '/auth/me', { token: tokens.access_token });
  console.log('ME', me.status, redact(me.text).slice(0, 800));

  fs.mkdirSync(OUT, { recursive: true });
  const report = [
    '# Tenant Live Login SUCCESS',
    `Email: ${email}`,
    `Timestamp: ${new Date().toISOString()}`,
    `UI: https://briktra.com/app/index.html#/login`,
    '',
    '## Login',
    `Status: ${login.status}`,
    '```json',
    redact(login.text),
    '```',
    '',
    '## /auth/me',
    `Status: ${me.status}`,
    '```json',
    redact(me.text),
    '```',
    '',
  ];
  fs.writeFileSync(path.join(OUT, 'Tenant-login-success.md'), report.join('\n'));
  console.log('Saved Tenant-login-success.md');
  return { tokens, me };
}

loginTenant().catch((e) => {
  console.error(e);
  process.exit(1);
});
