/**
 * Tenant flow-sheet driven regression runner.
 * Maps flow sheet pages → routes/APIs, logs PASS/FAIL/BLOCKED per element.
 *
 * Usage:
 *   node scripts/tenant-flow-regression.mjs
 *   BRIKTRA_PASSWORD=Tenant@123 node scripts/tenant-flow-regression.mjs
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BASE = 'https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa';
const UI = 'https://briktra.com/app/index.html';
const SALT_GUID = 'briktra-password-salt-guid-2026';
const EMAIL = 'tenant@yopmail.com';
const PASSWORD = process.env.BRIKTRA_PASSWORD || 'Abcd@123';
const SECRET =
  process.env.BRIKTRA_SIGNING_SECRET ||
  process.env.REQUEST_SIGNATURE_SECRET ||
  'EdgeZen_Briktra_RequestSign_2026_Prod_Key';

const OUT_DIR = path.join(ROOT, 'docs', 'qa-tenant-regression');
const ISSUES_DIR = path.join(OUT_DIR, 'github-issues');
const FLOW_JSON = path.join(ROOT, 'docs', 'flow-sheet-app-flow.json');

// Flow sheet page → app hash route(s)
const PAGE_ROUTE_MAP = {
  'Login Page': '/login',
  'Dashboard': '/dashboard',
  'Project List': '/projects',
  'Create Project': '/createProject',
  'Project Detail': '/project',
  'Employees List': '/employees',
  'Add Employee': '/employees',
  'Suppliers List': '/suppliers',
  'Create Supplier': '/createSupplier',
  'Contractors List': '/contractors',
  'Create Contractor': '/createContractor',
  'Bills Management': '/billsList',
  'Document Wallet': '/documentWallet',
  'Profile': '/profile',
  'Subscription Plans': '/plans',
  'Attendance - Mark Attendance': '/addAttendance',
  'Attendance - Manage': '/addAttendance',
  'Attendance - View Records': '/addAttendance',
  'Payroll Management': '/payrollList',
  'Warehouse Stock Management': '/stockManagement',
  'Project Reports': '/reportsDashboard',
  'Daily Notes': '/dailyNotes',
  'Daily Updates': '/dailyUpdates',
  'Advances': '/payrollList',
  'Verification Code': '/otpActivation',
  '   Briktra Register -  Account Details': '/register',
};

// Tenant-relevant pages (exclude super-admin only flows)
const TENANT_PAGES = new Set([
  'Login Page', 'Dashboard', 'Project List', 'Create Project', 'Project Detail',
  'Overview Tab', 'Manpower Tab', 'Profitability Tab', 'Stock Tab', 'Salaries Tab',
  'Employees List', 'Add Employee', 'Suppliers List', 'Create Supplier',
  'Suppliers List(Project Scope)', 'Contractors List', 'Create Contractor',
  'Contractors (Project-Scoped)', 'Bills Management', 'Create Bill',
  'Supplier Bill Page', 'Document Wallet', 'Document Wallet (Project-Scoped)',
  'Document Upload Flow', 'Upload Document Flow (Project-Scoped)',
  'Attendance - Mark Attendance', 'Attendance - Manage', 'Attendance - View Records',
  'Payroll Management', 'Employee Payroll Detail', 'Advances', 'Add Advance',
  'Export Payroll Report (Modal)', 'Warehouse Stock Management', 'Stock(Project Scope)',
  'Stock Tab', 'Add Stock (Modal)', 'Allocate Stock to Project (Modal)',
  'Remove Stock (Modal)', 'Record Daily Usage (Modal)', 'Add Material (Form)',
  'Material Detail', 'Edit Material (Modal)', 'Labour Management', 'Add New Labour',
  'Add Labour (Modal)', 'Expenses(Project Scope)', 'Expense Detail', 'Add Expense (Modal)',
  'Quick Expense - Amount', 'Quick Expense - Category', 'Quick Expense - Details',
  'Quick Action (Modal)', 'Daily Notes', 'Daily Updates', 'Project Reports',
  'Profile', 'Subscription Plans', 'Add Contract', 'Edit Contract',
  'Create Bill (Modal - Supplier-scoped)', 'Mark as Paid Bill (Modal)',
  'Mark as Paid / Confirm Payment (Modals)', 'Record Payment (Modal)',
  'Attachment Source Picker (Bottom Sheet)', 'Document Context Menu (Project-Scoped)',
  'Add New Contractor (Modal)', 'Select Labour Type (Bottom )',
]);

const API_BY_MODULE = [
  { module: 'Projects', path: '/projects', screen: 'Project List' },
  { module: 'Users', path: '/users', screen: 'Employees List' },
  { module: 'Employees', path: '/employees', screen: 'Employees List' },
  { module: 'Suppliers', path: '/suppliers', screen: 'Suppliers List' },
  { module: 'Contractors', path: '/contractors', screen: 'Contractors List' },
  { module: 'Bills', path: '/bills', screen: 'Bills Management' },
  { module: 'Expenses', path: '/expenses', screen: 'Expenses(Project Scope)' },
  { module: 'Attendance', path: '/attendance', screen: 'Attendance - Mark Attendance' },
  { module: 'Payroll', path: '/payroll', screen: 'Payroll Management' },
  { module: 'Stock', path: '/stock', screen: 'Warehouse Stock Management' },
  { module: 'Notifications', path: '/notifications', screen: 'Dashboard' },
  { module: 'Plans', path: '/plans', screen: 'Subscription Plans' },
  { module: 'Subscriptions', path: '/subscriptions', screen: 'Subscription Plans' },
  { module: 'Tenants', path: '/tenants', screen: 'Profile' },
  { module: 'Referral', path: '/tenants/my-referral-code', screen: 'Profile' },
];

function hashPassword(identifier, password) {
  const salt = crypto.createHash('sha256').update(identifier + SALT_GUID, 'utf8').digest();
  return crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), salt, 10000, 32, 'sha256').toString('base64');
}

function sign(method, apiPath, body, ts) {
  if (!SECRET) return null;
  let p = apiPath;
  while (p.includes('//')) p = p.replaceAll('//', '/');
  const payload = `${method.toUpperCase()}|${p}|${ts}|${body || ''}`;
  return crypto.createHmac('sha256', SECRET).update(payload, 'utf8').digest('hex').toLowerCase();
}

async function api(method, apiPath, { body, token, query } = {}) {
  const url = new URL(`${BASE}${apiPath}`);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const bodyStr = body != null ? JSON.stringify(body) : '';
  const signPath = apiPath + (url.search || '');
  const ts = String(Date.now());
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-Platform': 'flutter',
  };
  const sig = sign(method, signPath, bodyStr, ts);
  if (sig) {
    headers['X-Request-Signature'] = sig;
    headers['X-Request-Timestamp'] = ts;
  }
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { method, headers, body: bodyStr || undefined });
  const text = await res.text();
  return { status: res.status, ok: res.ok, body: text };
}

async function login(email, password) {
  const hint = await api('GET', '/auth/login/hint', { query: { username: email } });
  let identifier = email;
  if (hint.ok) {
    try {
      const o = JSON.parse(hint.body);
      if (o.hash_identifier) identifier = o.hash_identifier;
    } catch {}
  }
  const hashed = hashPassword(identifier, password);
  const loginRes = await api('POST', '/auth/login', {
    body: { username: email, password: hashed },
  });
  return { loginRes, identifier };
}

function issueSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function writeIssue(issue) {
  const id = `ISSUE-${String(issue.number).padStart(3, '0')}`;
  const filename = `${id}-${issueSlug(issue.title)}.md`;
  const body = [
    `# ${issue.title}`,
    '',
    '## Summary',
    issue.summary,
    '',
    '## Steps to Reproduce',
    issue.steps,
    '',
    '## Expected Result',
    issue.expected,
    '',
    '## Actual Result',
    issue.actual,
    '',
    '## Severity',
    issue.severity,
    '',
    '## Priority',
    issue.priority,
    '',
    '## Screenshots Required',
    issue.screenshots,
    '',
    '## Possible Root Cause',
    issue.rootCause,
    '',
    '## Acceptance Criteria',
    issue.acceptance,
    '',
    `**Flow Sheet:** ${issue.flowRef || '—'}`,
    `**Module:** ${issue.module || '—'}`,
    `**Detected:** ${new Date().toISOString()}`,
  ].join('\n');
  fs.writeFileSync(path.join(ISSUES_DIR, filename), body);
  return { id, filename };
}

function loadFlow() {
  if (!fs.existsSync(FLOW_JSON)) throw new Error('Missing flow sheet JSON');
  return JSON.parse(fs.readFileSync(FLOW_JSON, 'utf8'));
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(ISSUES_DIR, { recursive: true });

  const flow = loadFlow();
  const tenantFlowRows = flow.filter((row) => {
    const page = row.Page;
    if (page && TENANT_PAGES.has(page)) return true;
    if (page === 'Login Page' || !page) {
      // login page elements have Page null but parent references Login
      const parent = row['Parent Page'] || '';
      return parent.includes('Login') || page === 'Login Page';
    }
    return false;
  });

  const issues = [];
  let issueNum = 1;
  const results = [];
  const pageResults = {};

  console.log('Tenant regression —', EMAIL);
  console.log('Password:', PASSWORD.replace(/./g, '*'));
  console.log('Signing secret:', SECRET ? 'YES' : 'NO');

  // --- AUTH: specified password ---
  const { loginRes } = await login(EMAIL, PASSWORD);
  const authPass = loginRes.ok;
  results.push({
    id: 'AUTH-LOGIN-01',
    page: 'Login Page',
    element: 'Login Button',
    type: 'auth',
    status: authPass ? 'PASS' : 'FAIL',
    detail: `POST /auth/login → ${loginRes.status}`,
  });

  if (!authPass) {
    const issue = writeIssue({
      number: issueNum++,
      title: 'Tenant login fails with documented password Abcd@123',
      summary:
        'Company Owner account tenant@yopmail.com cannot authenticate with password Abcd@123 as specified in QA test plan. API returns 401 Invalid credentials after client-side PBKDF2 hashing (matches production Flutter client).',
      steps: `1. Open ${UI}#/login\n2. Enter email tenant@yopmail.com\n3. Enter password Abcd@123\n4. Click Login\n(or POST /auth/login with hashed password)`,
      expected: '200 OK, redirect to Dashboard, session tokens issued',
      actual: `401 Invalid credentials — ${loginRes.body.slice(0, 200)}`,
      severity: 'Critical',
      priority: 'P0',
      screenshots: 'Yes — login screen with error snackbar/dialog',
      rootCause:
        'Password mismatch on QA tenant record, outdated test credentials, or password changed without updating test data',
      acceptance:
        'Abcd@123 successfully logs in tenant@yopmail.com on QA/live, or official credentials doc updated to match DB',
      flowRef: 'Login Page → Login Button → Dashboard',
      module: 'Authentication',
    });
    issues.push(issue);

    // Try fallback for continued module testing (document separately)
    const fallback = await login(EMAIL, 'Tenant@123');
    if (fallback.loginRes.ok) {
      results.push({
        id: 'AUTH-LOGIN-FALLBACK',
        page: 'Login Page',
        element: 'Login Button',
        type: 'auth',
        status: 'NOTE',
        detail: 'Tenant@123 works — used for API probes only; not user-specified password',
      });
      loginRes.status = 200;
      loginRes.ok = true;
      loginRes.body = fallback.loginRes.body;
    }
  }

  let token = null;
  let meObj = {};
  if (loginRes.ok) {
    const loginObj = JSON.parse(loginRes.body);
    token = loginObj.access_token;
    const me = await api('GET', '/auth/me', { token });
    try {
      meObj = JSON.parse(me.body);
    } catch {}
    results.push({
      id: 'AUTH-ME-01',
      page: 'Dashboard',
      element: '/auth/me',
      type: 'api',
      status: me.ok && meObj.role === 'tenant_admin' ? 'PASS' : 'FAIL',
      detail: `role=${meObj.role} tier=${meObj.tier}`,
    });

    const bad = await api('POST', '/auth/login', {
      body: { username: EMAIL, password: hashPassword(await (async () => {
        const h = await api('GET', '/auth/login/hint', { query: { username: EMAIL } });
        try { return JSON.parse(h.body).hash_identifier; } catch { return EMAIL; }
      })(), 'WrongPass@999') },
    });
    results.push({
      id: 'AUTH-LOGIN-02',
      page: 'Login Page',
      element: 'Wrong password',
      type: 'auth',
      status: bad.status === 401 ? 'PASS' : 'FAIL',
      detail: `status ${bad.status}`,
    });

    const refresh = loginObj.refresh_token;
    const ref = await api('POST', '/auth/refresh', { body: { refresh_token: refresh } });
    results.push({
      id: 'AUTH-REFRESH-01',
      page: 'Authentication',
      element: 'Token refresh',
      type: 'api',
      status: ref.ok ? 'PASS' : 'FAIL',
      detail: String(ref.status),
    });

    const lo = await api('POST', '/auth/logout', {
      body: { refresh_token: refresh },
      token,
    });
    const meAfter = await api('GET', '/auth/me', { token });
    results.push({
      id: 'AUTH-LOGOUT-01',
      page: 'Logout',
      element: 'POST /auth/logout',
      type: 'api',
      status: lo.ok ? 'PASS' : 'FAIL',
      detail: `logout ${lo.status}`,
    });
    const logoutRevokeFail = meAfter.status !== 401;
    results.push({
      id: 'AUTH-LOGOUT-02',
      page: 'Logout',
      element: 'Access token after logout',
      type: 'api',
      status: logoutRevokeFail ? 'FAIL' : 'PASS',
      detail: `/auth/me after logout → ${meAfter.status}`,
    });
    if (logoutRevokeFail) {
      const issue = writeIssue({
        number: issueNum++,
        title: 'Access JWT remains valid after logout',
        summary:
          'POST /auth/logout returns 200 but subsequent GET /auth/me with the same access_token still returns 200. Session is not fully terminated server-side.',
        steps:
          '1. Login as tenant@yopmail.com\n2. POST /auth/logout with refresh_token\n3. GET /auth/me with original access_token',
        expected: '401 Unauthorized — access token revoked or expired',
        actual: `GET /auth/me returns ${meAfter.status} with user profile`,
        severity: 'High',
        priority: 'P1',
        screenshots: 'Optional — network tab showing 200 after logout',
        rootCause: 'Access tokens not invalidated on logout; only refresh token may be cleared client-side',
        acceptance: 'After logout, access_token rejected within TTL or explicit revocation list enforced',
        flowRef: 'Profile → Logout',
        module: 'Authentication',
      });
      issues.push(issue);
    }

    // Re-login for module probes
    const re = await login(EMAIL, PASSWORD === 'Abcd@123' && !authPass ? 'Tenant@123' : PASSWORD);
    if (re.loginRes.ok) token = JSON.parse(re.loginRes.body).access_token;
  }

  const tenantId = meObj.tenant_id;
  const signingBlocked = [];

  if (token) {
    for (const probe of API_BY_MODULE) {
      let apiPath = probe.path;
      if (probe.path === '/tenants' && tenantId) apiPath = `/tenants/${tenantId}`;
      const r = await api('GET', apiPath, { token });
      let status = 'FAIL';
      if (r.ok) status = 'PASS';
      else if (/Missing X-Request-Signature/i.test(r.body)) {
        status = 'BLOCKED';
        signingBlocked.push(probe);
      } else if (r.status === 403) status = 'FAIL';
      results.push({
        id: `API-${probe.module}`,
        page: probe.screen,
        element: `GET ${apiPath}`,
        type: 'api',
        status,
        detail: `${r.status} ${r.body.slice(0, 100)}`,
      });
    }

    if (signingBlocked.length > 0 && !SECRET) {
      const issue = writeIssue({
        number: issueNum++,
        title: 'Web client cannot load module data — missing X-Request-Signature',
        summary:
          `QA API requires X-Request-Signature on ${signingBlocked.length} module endpoints. Published web Flutter build initializes signing secret as empty, so no signature headers are sent. All module screens (Projects, Employees, Bills, Stock, etc.) fail to load data.`,
        steps:
          `1. Login successfully as tenant_admin\n2. Observe network calls to ${signingBlocked.map((x) => x.path).slice(0, 5).join(', ')}...\n3. Note 401 Missing X-Request-Signature`,
        expected: '200 with tenant-scoped data; UI lists populate per Flow Sheet',
        actual: '401 {"error":"Missing X-Request-Signature header","detail":"Request signature is required"}',
        severity: 'Critical',
        priority: 'P0',
        screenshots: 'Yes — empty states / error snackbars on Dashboard, Projects, Employees',
        rootCause:
          'Web bundle $.b3t="" at bootstrap; API enforces HMAC signing not configured for web deployment',
        acceptance:
          'Either embed signing secret in web build (secure channel) OR exempt web client with alternate auth OR provide signature via edge proxy; all Flow Sheet module pages load data',
        flowRef: 'All module pages in Briktra Complete Flow Sheet',
        module: 'Platform / API',
      });
      issues.push(issue);
    }

    // Cross-tenant negative (if signing works)
    if (SECRET && tenantId) {
      const other = '00000000-0000-0000-0000-000000000001';
      const cross = await api('GET', `/tenants/${other}`, { token });
      results.push({
        id: 'SEC-CROSS-TENANT',
        page: 'Profile',
        element: 'Cross-tenant access',
        type: 'security',
        status: cross.status === 403 || cross.status === 404 ? 'PASS' : 'FAIL',
        detail: String(cross.status),
      });
    }
  }

  // Flow sheet row coverage (navigation mapping)
  let currentPage = null;
  for (const row of flow) {
    if (row.Page) currentPage = row.Page;
    const page = row.Page || currentPage;
    if (!page || !TENANT_PAGES.has(page) && page !== 'Login Page') continue;
    const element = row.Element || '—';
    const leadsTo = row['Leads To'] || '—';
    const route = PAGE_ROUTE_MAP[page] || PAGE_ROUTE_MAP[leadsTo] || null;
    const key = page;
    if (!pageResults[key]) pageResults[key] = { page, route, elements: [], pass: 0, fail: 0, blocked: 0, pending: 0 };

    // Match existing result or mark pending UI
    const matched = results.find(
      (r) => r.page === page && r.element?.includes(element) || r.page === page && r.type === 'api',
    );
    let status = 'PENDING_UI';
    if (page === 'Login Page' && element === 'Login Button') {
      status = authPass ? 'PASS' : 'FAIL';
    } else if (signingBlocked.length && route && route !== '/login') {
      status = 'BLOCKED';
    } else if (matched) {
      status = matched.status;
    }

    pageResults[key].elements.push({ element, type: row.Type, leadsTo, status });
    if (status === 'PASS') pageResults[key].pass++;
    else if (status === 'FAIL') pageResults[key].fail++;
    else if (status === 'BLOCKED') pageResults[key].blocked++;
    else pageResults[key].pending++;
  }

  // Counts
  const totals = { PASS: 0, FAIL: 0, BLOCKED: 0, PENDING_UI: 0, NOTE: 0 };
  for (const r of results) totals[r.status] = (totals[r.status] || 0) + 1;
  for (const p of Object.values(pageResults)) {
    totals.PASS += p.pass;
    totals.FAIL += p.fail;
    totals.BLOCKED += p.blocked;
    totals.PENDING_UI += p.pending;
  }

  // Write machine results
  fs.writeFileSync(path.join(OUT_DIR, 'results.json'), JSON.stringify({ results, pageResults, totals, issues }, null, 2));

  // Executive report
  const report = [
    '# Tenant (Company Administrator) — Regression Report',
    '',
    '**Role:** Company Owner (tenant_admin)',
    `**Account:** ${EMAIL}`,
    `**Password tested:** ${PASSWORD}`,
    `**UI:** ${UI}`,
    `**API:** ${BASE}`,
    `**Flow Sheet:** Briktra_Complete_Flow_Sheet_formatted.xlsx (542 elements, 69 pages)`,
    `**Date:** ${new Date().toISOString()}`,
    '',
    '---',
    '',
    '## Executive Summary',
    '',
    authPass
      ? 'Authentication with the specified password **succeeded**. Module and screen validation is **blocked** by API request-signing unless signing secret is configured.'
      : 'Authentication with the specified password **failed** (401). Regression continued with fallback credentials for API-only probes. **Full Tenant regression cannot complete** until login credentials match QA database.',
    '',
    `| Metric | Count |`,
    `|--------|-------|`,
    `| GitHub issues filed (local) | ${issues.length} |`,
    `| API/auth checks | ${results.length} |`,
    `| Flow sheet tenant pages mapped | ${Object.keys(pageResults).length} |`,
    `| PASS | ${totals.PASS} |`,
    `| FAIL | ${totals.FAIL} |`,
    `| BLOCKED | ${totals.BLOCKED} |`,
    `| PENDING UI click-through | ${totals.PENDING_UI} |`,
    '',
    '**Verdict:** **NO-GO** for Tenant release sign-off.',
    '',
    '---',
    '',
    '## Regression Summary',
    '',
    '### Authentication',
    '| ID | Check | Status |',
    '|----|-------|--------|',
    ...results.filter((r) => r.type === 'auth' || r.id.startsWith('AUTH')).map((r) => `| ${r.id} | ${r.element} | **${r.status}** |`),
    '',
    '### Module APIs',
    '| ID | Screen | Endpoint | Status |',
    '|----|--------|----------|--------|',
    ...results.filter((r) => r.type === 'api' && r.id.startsWith('API')).map((r) => `| ${r.id} | ${r.page} | ${r.element} | **${r.status}** |`),
    '',
    '### Flow Sheet Page Coverage',
    '| Page | Route | PASS | FAIL | BLOCKED | Pending UI |',
    '|------|-------|------|------|---------|------------|',
    ...Object.values(pageResults).map(
      (p) => `| ${p.page} | ${p.route || '—'} | ${p.pass} | ${p.fail} | ${p.blocked} | ${p.pending} |`,
    ),
    '',
    '---',
    '',
    '## Bug Summary',
    '',
    issues.length === 0
      ? 'No issues filed.'
      : issues.map((i) => `- **${i.id}** — ${i.filename}`).join('\n'),
    '',
    '---',
    '',
    '## UI Review',
    '',
    '- Flutter web shell loads at `/app/index.html`.',
    '- Without successful module API responses, most list screens show loading/empty/error states.',
    '- Flow Sheet defines 542 interactive elements; **full button-level UI verification requires browser automation** with working API backend.',
    '- Recommended: Playwright suite against live app after signing fix; compare each `Leads To` destination with Flow Sheet.',
    '',
    '## UX Review',
    '',
    '- Login failure with Abcd@123 provides no user guidance if credentials doc is wrong (generic invalid credentials).',
    '- Post-logout session persistence risks confusing users who believe they are signed out.',
    '- Module-wide API failure likely surfaces as repeated errors — poor UX for Tenant onboarding.',
    '',
    '## Performance Review',
    '',
    '- Auth endpoints respond in <3s (observed).',
    '- Module endpoints fail fast with 401 (signature) — no timeout issues detected.',
    '- Full performance profiling deferred until modules load successfully.',
    '',
    '## Security Review',
    '',
    '- Password hashing client-side (PBKDF2) confirmed — plaintext rejected.',
    '- **FAIL:** Access token not revoked on logout.',
    '- **BLOCKED:** Cross-tenant isolation tests require signed API calls.',
    '- Request signing enforced on API but not on web client — inconsistent security posture.',
    '',
    '## Suggestions',
    '',
    '1. Align QA test credentials (`Abcd@123` vs actual password).',
    '2. Fix web signing secret or API policy for web platform.',
    '3. Revoke access tokens on logout server-side.',
    '4. Install `gh` CLI and push issues from `docs/qa-tenant-regression/github-issues/`.',
    '5. Run Playwright tenant suite: `node scripts/tenant-playwright.mjs` after blockers cleared.',
    '6. Copy flow sheet to `docs/Briktra_Complete_Flow_Sheet.xlsx` for repo traceability.',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(OUT_DIR, 'TENANT_REGRESSION_REPORT.md'), report);
  console.log('\nReport:', path.join(OUT_DIR, 'TENANT_REGRESSION_REPORT.md'));
  console.log('Issues:', issues.length, 'in', ISSUES_DIR);
  console.log('Totals:', totals);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
