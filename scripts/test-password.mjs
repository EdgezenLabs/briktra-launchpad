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

// Live Briktra app uses PROD. Override with BRIKTRA_API_BASE for QA.
const BASE = process.env.BRIKTRA_API_BASE || '';
const SALT = process.env.BRIKTRA_SALT_GUID || '';

function hash(id, pw) {
  const salt = crypto.createHash('sha256').update(id + SALT, 'utf8').digest();
  return crypto.pbkdf2Sync(Buffer.from(pw, 'utf8'), salt, 10000, 32, 'sha256').toString('base64');
}

const email = process.argv[2] || process.env.TENANT_EMAIL || process.env.BRIKTRA_EMAIL || '';
const pw = process.argv[3] || process.env.TENANT_PASSWORD || process.env.BRIKTRA_PASSWORD || '';
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
