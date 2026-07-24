/**
 * Briktra API role explorer (Node)
 * Run: node scripts/explore-roles.mjs
 * Writes redacted reports to docs/role-exploration/
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa';
const OUT = path.join(__dirname, '..', 'docs', 'role-exploration');

const ACCOUNTS = [
  { role: 'Tenant', email: 'tenant@yopmail.com', password: 'Tenant@123' },
  { role: 'Manager', email: 'briktramanager@yopmail.com', password: 'Manager@123' },
  { role: 'Supervisor', email: 'briktrasupervisor@yopmail.com', password: 'Supervisor@123' },
  { role: 'Employee', email: 'briktraemployee@yopmail.com', password: 'Employee@123' },
];

function redact(s) {
  if (!s) return s;
  return String(s)
    .replace(/("access_token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"')
    .replace(/("refresh_token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"')
    .replace(/("id_token"\s*:\s*")[^"]+"/g, '$1***REDACTED***"');
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

async function api(method, apiPath, { body, token } = {}) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${apiPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text, ok: res.ok };
}

function pick(obj, ...keys) {
  for (const k of keys) {
    if (obj && obj[k] != null) return obj[k];
  }
  return null;
}

async function explore({ role, email, password }) {
  console.log(`\n===== ${role} (${email}) =====`);
  const lines = [];
  lines.push(`# Role Exploration: ${role}`);
  lines.push(`Email: ${email}`);
  lines.push(`Timestamp: ${new Date().toISOString()}`);
  lines.push(`API: ${BASE}`);
  lines.push('');

  const bad = await api('POST', '/auth/login', {
    body: { username: email, password: 'DefinitelyWrong@999' },
  });
  lines.push('## Incorrect password', `Status: ${bad.status}`, '```json', redact(bad.body), '```', '');

  const loginBodies = [
    { username: email, password },
    { email, password },
    { email_or_phone: email, password },
    { phone: email, password },
  ];

  let login = null;
  let usedBody = null;
  for (const body of loginBodies) {
    const attempt = await api('POST', '/auth/login', { body });
    lines.push(
      `### Attempt payload keys: ${Object.keys(body).join(', ')}`,
      `Status: ${attempt.status}`,
      '```json',
      redact(attempt.body),
      '```',
      ''
    );
    console.log('Login attempt', Object.keys(body).join('+'), '->', attempt.status);
    if (attempt.ok) {
      login = attempt;
      usedBody = body;
      break;
    }
    if (!login) login = attempt; // keep last for failure write
  }
  if (usedBody) lines.push(`## Successful login payload keys: ${Object.keys(usedBody).join(', ')}`, '');
  lines.push('## Login (final)', `Status: ${login.status}`, '```json', redact(login.body), '```', '');
  console.log('Login final:', login.status);

  fs.mkdirSync(OUT, { recursive: true });
  if (!login.ok) {
    fs.writeFileSync(path.join(OUT, `${role}.md`), lines.join('\n'), 'utf8');
    return;
  }

  const loginObj = JSON.parse(login.body);
  const token = loginObj.access_token;
  const refresh = loginObj.refresh_token;
  lines.push('## Access token claims (decoded, unverified)', '```json', redact(decodeJwt(token)), '```', '');

  const me = await api('GET', '/auth/me', { token });
  lines.push('## GET /auth/me', `Status: ${me.status}`, '```json', redact(me.body), '```', '');
  console.log('Me:', me.status);

  let tenantId = null;
  let projectId = null;
  try {
    const meObj = JSON.parse(me.body);
    const candidates = [meObj, meObj.user, meObj.data, meObj.profile].filter(Boolean);
    for (const c of candidates) {
      if (!tenantId) tenantId = pick(c, 'tenant_id', 'tenantId');
    }
  } catch {}

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
  ];
  if (tenantId) {
    probes.push(['GET', `/tenants/${tenantId}`]);
    probes.push(['GET', `/tenants/${tenantId}/project-settings`]);
  }

  lines.push('## Endpoint probe matrix', '| Method | Path | Status | Notes |', '|--------|------|--------|-------|');
  for (const [method, p] of probes) {
    const r = await api(method, p, { token });
    const note = (r.body || '').slice(0, 140).replace(/\n/g, ' ').replace(/\|/g, '/');
    lines.push(`| ${method} | \`${p}\` | ${r.status} | ${note} |`);
    console.log(`  ${method} ${p} -> ${r.status}`);
    if (p === '/projects' && r.ok) {
      try {
        const pj = JSON.parse(r.body);
        const arr = Array.isArray(pj)
          ? pj
          : pj.data || pj.projects || pj.items || [];
        if (Array.isArray(arr) && arr[0]?.id) projectId = arr[0].id;
      } catch {}
    }
  }
  lines.push('');

  if (projectId) {
    lines.push(`## Project-scoped probes (project_id=${projectId})`);
    lines.push('| Method | Path | Status | Notes |', '|--------|------|--------|-------|');
    for (const p of [
      `/projects/${projectId}`,
      `/users/project/${projectId}/employees`,
      `/projects/${projectId}/sub-projects`,
      `/attendance/project/${projectId}`,
      `/expenses/project/${projectId}`,
      `/daily-uploads/project/${projectId}`,
      `/reports/project/${projectId}`,
    ]) {
      const r = await api('GET', p, { token });
      const note = (r.body || '').slice(0, 100).replace(/\n/g, ' ').replace(/\|/g, '/');
      lines.push(`| GET | \`${p}\` | ${r.status} | ${note} |`);
      console.log(`  GET ${p} -> ${r.status}`);
    }
    lines.push('');
  }

  const ref = await api('POST', '/auth/refresh', { body: { refresh_token: refresh } });
  lines.push('## POST /auth/refresh', `Status: ${ref.status}`, '```json', redact(ref.body), '```', '');

  const lo = await api('POST', '/auth/logout', { body: { refresh_token: refresh }, token });
  lines.push('## POST /auth/logout', `Status: ${lo.status}`, '```json', redact(lo.body), '```', '');

  const me2 = await api('GET', '/auth/me', { token });
  lines.push('## Post-logout GET /auth/me (same access token)', `Status: ${me2.status}`, '```json', redact(me2.body), '```');

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, `${role}.md`), lines.join('\n'), 'utf8');
  console.log('Saved', path.join(OUT, `${role}.md`));
}

for (const a of ACCOUNTS) {
  await explore(a);
  await new Promise((r) => setTimeout(r, 800));
}
console.log('\nDone.');
