/**
 * Briktra security assessment probes (PROD).
 * Safe authorization/session/header checks only â€” no injection/exploit payloads.
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
const UI = process.env.BRIKTRA_UI_BASE || '';
const SALT = process.env.BRIKTRA_SALT_GUID || '';
const OUT = path.join(ROOT, 'docs', 'QA', 'security');

fs.mkdirSync(OUT, { recursive: true });

function hashPassword(identifier, password) {
  const salt = crypto.createHash('sha256').update(identifier + SALT, 'utf8').digest();
  return crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), salt, 10000, 32, 'sha256').toString('base64');
}

async function api(method, apiPath, { body, token, headers: extra = {}, query } = {}) {
  const url = new URL(BASE + apiPath);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-Platform': 'flutter',
    ...extra,
  };
  if (token !== undefined && token !== null) {
    if (token === '') headers.Authorization = 'Bearer';
    else headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return {
    status: res.status,
    ok: res.ok,
    body: text,
    bodyPreview: text.slice(0, 500),
    headers: Object.fromEntries(res.headers),
  };
}

async function login(email, password) {
  const hint = await api('GET', '/auth/login/hint', { query: { username: email } });
  let id = email;
  try {
    id = JSON.parse(hint.body).hash_identifier || email;
  } catch {}
  const loginRes = await api('POST', '/auth/login', {
    body: { username: email, password: hashPassword(id, password) },
  });
  let obj = {};
  try {
    obj = JSON.parse(loginRes.body);
  } catch {}
  return { hint, login: loginRes, obj, id };
}

function decodeJwt(tok) {
  try {
    const [h, p] = tok.split('.');
    return {
      header: JSON.parse(Buffer.from(h, 'base64url').toString()),
      payload: JSON.parse(Buffer.from(p, 'base64url').toString()),
    };
  } catch (e) {
    return { error: String(e) };
  }
}

const findings = [];
function add(id, category, title, severity, status, evidence, impact, remediation) {
  findings.push({ id, category, title, severity, status, evidence, impact, remediation });
}

async function main() {
  const accounts = [
    {
      role: 'tenant_admin',
      email: process.env.TENANT_EMAIL || process.env.BRIKTRA_TENANT_EMAIL || process.env.BRIKTRA_EMAIL || '',
      password: process.env.TENANT_PASSWORD || process.env.BRIKTRA_TENANT_PASSWORD || process.env.BRIKTRA_PASSWORD || '',
    },
    {
      role: 'manager',
      email: process.env.MANAGER_EMAIL || process.env.BRIKTRA_MANAGER_EMAIL || '',
      password: process.env.MANAGER_PASSWORD || process.env.BRIKTRA_MANAGER_PASSWORD || '',
    },
    {
      role: 'supervisor',
      email: process.env.SUPERVISOR_EMAIL || process.env.BRIKTRA_SUPERVISOR_EMAIL || '',
      password: process.env.SUPERVISOR_PASSWORD || process.env.BRIKTRA_SUPERVISOR_PASSWORD || '',
    },
    {
      role: 'employee',
      email: process.env.EMPLOYEE_EMAIL || process.env.BRIKTRA_EMPLOYEE_EMAIL || '',
      password: process.env.EMPLOYEE_PASSWORD || process.env.BRIKTRA_EMPLOYEE_PASSWORD || '',
    },
  ];

  const sessions = {};
  console.log('=== Login all roles ===');
  for (const a of accounts) {
    const r = await login(a.email, a.password);
    sessions[a.role] = r;
    console.log(a.role, r.login.status, r.obj.role || r.login.body.slice(0, 80));
    if (!r.login.ok) {
      add(
        `SEC-AUTH-LOGIN-${a.role}`,
        'Authentication',
        `Login failed for ${a.role}`,
        'Critical',
        'FAIL',
        String(r.login.status),
        'Cannot assess role security without session',
        'Fix credentials / auth',
      );
    }
  }

  const emp = sessions.employee?.obj || {};
  const mgr = sessions.manager?.obj || {};
  const empTok = emp.access_token;
  const empTid = emp.tenant_id;
  const jwtInfo = empTok ? decodeJwt(empTok) : {};
  console.log('JWT alg', jwtInfo.header?.alg, 'claims', Object.keys(jwtInfo.payload || {}));

  // Unauthorized APIs
  console.log('=== Unauthorized (no token) ===');
  for (const [m, p] of [
    ['GET', '/auth/me'],
    ['GET', '/projects'],
    ['GET', '/users'],
    ['GET', '/tenants'],
    ['GET', '/bills'],
    ['GET', '/admin/plan-config'],
  ]) {
    const r = await api(m, p);
    const pass = r.status === 401 || r.status === 403;
    add(
      `SEC-UNAUTH-${p.replace(/\W+/g, '-')}`,
      'Unauthorized APIs',
      `Unauthenticated ${m} ${p}`,
      pass ? 'Info' : 'High',
      pass ? 'PASS' : 'FAIL',
      String(r.status),
      'Data exposure without authentication',
      'Require valid Bearer on all protected routes',
    );
    console.log('no-token', m, p, r.status);
  }

  // Broken access control â€” employee
  console.log('=== Employee BAC ===');
  if (empTok) {
    const adminPaths = [
      ['GET', '/tenants', { query: { skip: 0, limit: 25 } }],
      ['GET', '/users', { query: { role: 'tenant_admin', limit: 50, skip: 0 } }],
      ['GET', '/admin/plan-config', { query: { tenant_id: empTid } }],
      ['GET', '/subscriptions/status', { query: { tenant_id: empTid } }],
      ['GET', '/bills', { query: { skip: 0, limit: 25, tenant_id: empTid } }],
      ['GET', '/projects', { query: { skip: 0, limit: 10, tenant_id: empTid } }],
      ['POST', '/tenants', { body: { name: 'SEC_TEST_SHOULD_FAIL' } }],
    ];
    for (const [m, p, opts] of adminPaths) {
      const r = await api(m, p, { token: empTok, ...opts });
      const denied = r.status === 401 || r.status === 403;
      const success = r.status === 200 || r.status === 201;
      add(
        `SEC-BAC-EMP-${m}-${p.replace(/\W+/g, '-')}`,
        'Broken Access Control',
        `Employee ${m} ${p}`,
        denied ? 'Info' : success ? 'Critical' : 'High',
        denied ? 'PASS' : 'FAIL',
        `${r.status} ${(r.bodyPreview || r.body).slice(0, 140)}`,
        'Privilege escalation / sensitive data disclosure',
        'Enforce server-side RBAC per role and method',
      );
      console.log('emp', m, p, r.status, r.body.slice(0, 90));
    }
  }

  // Manager role escalation â€” create tenant
  if (mgr.access_token) {
    const r = await api('POST', '/tenants', {
      token: mgr.access_token,
      body: { name: 'SEC_TEST_SHOULD_FAIL' },
    });
    const denied = r.status === 401 || r.status === 403;
    add(
      'SEC-ESC-MGR-POST-tenants',
      'Role Escalation',
      'Manager POST /tenants',
      denied ? 'Info' : 'Critical',
      denied ? 'PASS' : 'FAIL',
      `${r.status} ${r.body.slice(0, 140)}`,
      'Cross-tenant creation / platform abuse',
      'Allow tenant creation only for authorized super-admin roles',
    );
    console.log('mgr POST /tenants', r.status, r.body.slice(0, 100));
  }

  // JWT rejection â€” malformed/empty/truncated only (no forged signed tokens)
  console.log('=== JWT invalid token rejection ===');
  for (const [name, tok] of [
    ['empty-bearer', ''],
    ['garbage', 'not.a.jwt'],
    ['truncated', empTok ? empTok.slice(0, 24) : 'abc'],
  ]) {
    const r = await api('GET', '/auth/me', { token: tok });
    const denied = r.status === 401 || r.status === 403;
    add(
      `SEC-JWT-${name}`,
      'JWT Manipulation',
      `Reject invalid JWT (${name})`,
      denied ? 'Info' : 'Critical',
      denied ? 'PASS' : 'FAIL',
      String(r.status),
      'Authentication bypass via malformed token',
      'Strict JWT verification (signature, alg whitelist, expiry)',
    );
    console.log('jwt', name, r.status);
  }

  // Mass assignment â€” attempt role field update then verify /auth/me
  console.log('=== Mass assignment ===');
  if (empTok && emp.user_id) {
    const r = await api('PUT', `/users/${emp.user_id}`, {
      token: empTok,
      query: { tenant_id: empTid },
      body: { role: 'tenant_admin', name: 'Employee', email: emp.email },
    });
    const r2 = await api('PATCH', `/users/${emp.user_id}`, {
      token: empTok,
      query: { tenant_id: empTid },
      body: { role: 'tenant_admin' },
    });
    add(
      'SEC-MASS-PUT-role',
      'Mass Assignment',
      'Employee PUT /users/{id} with role=tenant_admin',
      [401, 403, 404, 405].includes(r.status) ? 'Info' : r.status === 200 ? 'Critical' : 'Medium',
      r.status === 200 || r.status === 201 ? 'FAIL' : 'PASS',
      `${r.status} ${r.body.slice(0, 150)}`,
      'Self-service privilege escalation',
      'Deny role changes on self-update; whitelist fields',
    );
    add(
      'SEC-MASS-PATCH-role',
      'Mass Assignment',
      'Employee PATCH /users/{id} role',
      [401, 403, 404, 405].includes(r2.status) ? 'Info' : r2.status === 200 ? 'Critical' : 'Medium',
      r2.status === 200 || r2.status === 201 ? 'FAIL' : 'PASS',
      `${r2.status} ${r2.body.slice(0, 150)}`,
      'Self-service privilege escalation',
      'Whitelist updatable fields server-side',
    );
    console.log('mass PUT', r.status, r.body.slice(0, 100));
    console.log('mass PATCH', r2.status, r2.body.slice(0, 100));
    const me = await api('GET', '/auth/me', { token: empTok, query: { tenant_id: empTid } });
    const stillEmp = /"role"\s*:\s*"employee"/.test(me.body);
    add(
      'SEC-MASS-VERIFY',
      'Mass Assignment',
      'Role remains employee after elevation attempt',
      stillEmp ? 'Info' : 'Critical',
      stillEmp ? 'PASS' : 'FAIL',
      me.body.slice(0, 200),
      'Persistent privilege escalation',
      'Audit update handlers; never trust client role claim alone',
    );
    console.log('me after mass', me.status, me.body.slice(0, 120));
  }

  // Logout / session
  console.log('=== Logout revoke ===');
  {
    const empEmail = process.env.EMPLOYEE_EMAIL || process.env.BRIKTRA_EMPLOYEE_EMAIL || '';
    const empPass = process.env.EMPLOYEE_PASSWORD || process.env.BRIKTRA_EMPLOYEE_PASSWORD || '';
    const re = await login(empEmail, empPass);
    const lo = await api('POST', '/auth/logout', {
      token: re.obj.access_token,
      body: { refresh_token: re.obj.refresh_token },
    });
    const me2 = await api('GET', '/auth/me', { token: re.obj.access_token });
    add(
      'SEC-SESS-LOGOUT-ACCESS',
      'Session Hijacking',
      'Access JWT remains valid after logout',
      me2.status === 401 ? 'Info' : 'High',
      me2.status === 401 ? 'PASS' : 'FAIL',
      `logout=${lo.status} me=${me2.status}`,
      'Stolen access token usable after user logout',
      'Revoke/blacklist access tokens; keep access TTL short',
    );
    console.log('logout', lo.status, 'me', me2.status);

    const rf = await api('POST', '/auth/refresh', { body: { refresh_token: re.obj.refresh_token } });
    add(
      'SEC-SESS-REFRESH-AFTER-LOGOUT',
      'Expired Token / Session',
      'Refresh token usable after logout',
      rf.status === 401 || rf.status === 403 ? 'Info' : 'High',
      rf.status === 401 || rf.status === 403 ? 'PASS' : 'FAIL',
      `${rf.status} ${rf.body.slice(0, 120)}`,
      'Session continuation after logout',
      'Invalidate refresh tokens server-side on logout',
    );
    console.log('refresh after logout', rf.status, rf.body.slice(0, 100));
  }

  // Expired token â€” use clearly expired-looking JWT structure without forging signature success path
  // We only assert server rejects tokens with invalid signature + old exp claim shape via truncated path above.
  add(
    'SEC-EXP-NOTE',
    'Expired Token',
    'Native exp claim enforcement â€” observe JWT exp and require retest with aged token',
    'Medium',
    'REVIEW',
    `alg=${jwtInfo.header?.alg} exp=${jwtInfo.payload?.exp} iat=${jwtInfo.payload?.iat}`,
    'Expired tokens accepted would extend session risk',
    'Enforce exp/nbf; clock skew limits; reject expired access tokens',
  );

  // IDOR
  if (empTok && mgr.user_id) {
    const r = await api('GET', '/users', {
      token: empTok,
      query: { user_id: mgr.user_id, tenant_id: empTid },
    });
    const leaked = r.status === 200 && r.body.includes(mgr.user_id);
    add(
      'SEC-IDOR-USER',
      'Broken Access Control',
      'Employee GET /users?user_id=<manager>',
      leaked ? 'High' : 'Info',
      leaked ? 'FAIL' : 'PASS',
      `${r.status} ${r.body.slice(0, 150)}`,
      'Cross-user data disclosure (IDOR)',
      'Object-level authorization on user reads',
    );
    console.log('idor', r.status, r.body.slice(0, 120));
  }

  // Headers / CORS / CSP
  console.log('=== Security headers ===');
  {
    const apiHead = await fetch(`${BASE}/auth/login/hint?username=employee.briktra%40yopmail.com`, {
      headers: { Accept: 'application/json' },
    });
    const uiHead = await fetch(UI);
    const ah = Object.fromEntries(apiHead.headers);
    const uh = Object.fromEntries(uiHead.headers);
    add(
      'SEC-HDR-API-CORS',
      'CSRF / CORS',
      'API CORS configuration review',
      'Medium',
      'REVIEW',
      JSON.stringify({
        acao: ah['access-control-allow-origin'],
        acac: ah['access-control-allow-credentials'],
        vary: ah.vary,
      }),
      'Over-permissive CORS enables browser-based abuse',
      'Restrict Access-Control-Allow-Origin; avoid * with credentials',
    );
    add(
      'SEC-HDR-UI-CSP',
      'XSS',
      'UI Content-Security-Policy / framing headers',
      uh['content-security-policy'] ? 'Info' : 'Medium',
      uh['content-security-policy'] ? 'PASS' : 'FAIL',
      JSON.stringify({
        csp: uh['content-security-policy'] || null,
        xfo: uh['x-frame-options'] || null,
        xcto: uh['x-content-type-options'] || null,
        referrer: uh['referrer-policy'] || null,
      }),
      'Missing CSP increases XSS impact',
      'Deploy strict CSP, X-Frame-Options/frame-ancestors, nosniff',
    );
    console.log('API ACAO', ah['access-control-allow-origin']);
    console.log('UI CSP', uh['content-security-policy'], 'XFO', uh['x-frame-options']);
  }

  // Upload discovery â€” no file bytes uploaded
  console.log('=== Upload discovery ===');
  for (const p of ['/documents/upload', '/upload', '/files', '/media/upload']) {
    const r = await api('POST', p, {
      token: empTok,
      body: { filename: 'probe.txt', content_type: 'text/plain' },
    });
    add(
      `SEC-UPLOAD-${p.replace(/\W+/g, '-')}`,
      'File Upload Validation',
      `Upload endpoint probe ${p}`,
      'Info',
      'REVIEW',
      `${r.status} ${r.body.slice(0, 120)}`,
      'Unsafe upload surfaces if present without validation',
      'Authz + type/size/magic-byte checks + malware scan + private storage',
    );
    console.log('upload', p, r.status, r.body.slice(0, 80));
  }

  // Account enumeration via hint
  {
    const r = await api('GET', '/auth/login/hint', {
      query: { username: 'nonexistent-user-xyz@example.com' },
    });
    add(
      'SEC-ENUM-HINT',
      'Unauthorized APIs',
      'Login hint response for nonexistent user',
      'Low',
      'REVIEW',
      `${r.status} ${r.body.slice(0, 150)}`,
      'Account enumeration',
      'Uniform responses for known/unknown usernames',
    );
    console.log('hint nonexistent', r.status, r.body.slice(0, 120));
  }

  // Policy skips
  add(
    'SEC-SQLI-SKIP',
    'SQL Injection',
    'Active SQL injection payload testing not executed',
    'Info',
    'SKIPPED',
    'No exploit payloads sent to remote endpoints. Recommend staging suite + query parameterization audit.',
    'Data breach / auth bypass via injection',
    'Parameterized queries/ORM; WAF; staging SQLi regression',
  );
  add(
    'SEC-XSS-SKIP',
    'XSS',
    'Active XSS payload injection not executed',
    'Info',
    'SKIPPED',
    'CSP/header review performed. Recommend stored/reflected XSS tests on notes/bills/profile in staging.',
    'Session theft via script injection',
    'Output encoding; CSP; sanitize rich text fields',
  );
  add(
    'SEC-CSRF-NOTE',
    'CSRF',
    'CSRF residual risk with Bearer-auth APIs',
    'Low',
    'REVIEW',
    'Primary API auth uses Authorization Bearer (reduces classic cookie CSRF). Confirm no cookie-only state-changing routes.',
    'Unauthorized state changes from malicious sites',
    'Keep Bearer-only for mutations; SameSite if cookies used',
  );

  // Prior QA RBAC UI findings cross-ref
  add(
    'SEC-UI-RBAC-PRIOR',
    'Role Escalation',
    'UI deep-links expose admin chrome to Manager/Supervisor/Employee (prior QA)',
    'Critical',
    'FAIL',
    'See docs/QA master catalog: Create Tenant, Tenant Admins, Super Admin, Plans, Company Settings',
    'Client-side privilege exposure; may pair with weak API RBAC',
    'Route guards + server enforcement; hide admin nav',
  );

  const summary = {
    date: new Date().toISOString(),
    base: BASE,
    ui: UI,
    methodology:
      'Authorized security assessment on owned PROD. Authorization, session, headers, and discovery only. No SQLi/XSS/exploit payloads.',
    jwt_observation: {
      alg: jwtInfo.header?.alg,
      claims: Object.keys(jwtInfo.payload || {}),
      exp: jwtInfo.payload?.exp,
      iat: jwtInfo.payload?.iat,
      role_claim: jwtInfo.payload?.role ?? null,
      sub: jwtInfo.payload?.sub,
    },
    findings,
    counts: findings.reduce((a, f) => {
      a[f.status] = (a[f.status] || 0) + 1;
      a[`sev_${f.severity}`] = (a[`sev_${f.severity}`] || 0) + 1;
      return a;
    }, {}),
  };

  fs.writeFileSync(path.join(OUT, 'security-probe-results.json'), JSON.stringify(summary, null, 2));
  console.log('Wrote', path.join(OUT, 'security-probe-results.json'));
  console.log('Counts', summary.counts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
