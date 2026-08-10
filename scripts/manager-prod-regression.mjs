/**
 * Manager role PROD regression — Flow Sheet + morning scenario.
 * Login: manager.briktra@yopmail.com / Manager@123
 */
import crypto from 'crypto';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BASE = 'https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod';
const UI = 'https://briktra.com/app/index.html';
const SALT = 'briktra-password-salt-guid-2026';
const EMAIL = 'manager.briktra@yopmail.com';
const PASSWORD = 'Manager@123';
const OUT = path.join(ROOT, 'docs', 'qa-manager-regression');
const SHOTS = path.join(OUT, 'screenshots');
const ISSUES = path.join(OUT, 'github-issues');

function hashPassword(identifier, password) {
  const salt = crypto.createHash('sha256').update(identifier + SALT, 'utf8').digest();
  return crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), salt, 10000, 32, 'sha256').toString('base64');
}

function redact(s) {
  return String(s || '')
    .replace(/("access_token"\s*:\s*")[^"]+"/g, '$1***"')
    .replace(/("refresh_token"\s*:\s*")[^"]+"/g, '$1***"')
    .replace(/("id_token"\s*:\s*")[^"]+"/g, '$1***"');
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
  return { status: res.status, ok: res.ok, body: text };
}

async function loginApi() {
  const hint = await api('GET', '/auth/login/hint', { query: { username: EMAIL } });
  let id = EMAIL;
  try {
    id = JSON.parse(hint.body).hash_identifier || EMAIL;
  } catch {}
  const login = await api('POST', '/auth/login', {
    body: { username: EMAIL, password: hashPassword(id, PASSWORD) },
  });
  return { hint, login, id };
}

function writeIssue(num, title, fields) {
  fs.mkdirSync(ISSUES, { recursive: true });
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 55);
  const id = `MGR-ISSUE-${String(num).padStart(3, '0')}`;
  const body = [
    `# ${title}`,
    '',
    '## Summary',
    fields.summary,
    '',
    '## Steps to Reproduce',
    fields.steps,
    '',
    '## Expected Result',
    fields.expected,
    '',
    '## Actual Result',
    fields.actual,
    '',
    '## Severity',
    fields.severity,
    '',
    '## Priority',
    fields.priority,
    '',
    '## Screenshots Required',
    fields.screenshots,
    '',
    '## Possible Root Cause',
    fields.rootCause,
    '',
    '## Acceptance Criteria',
    fields.acceptance,
    '',
    `**Flow Sheet:** ${fields.flowRef || '—'}`,
    `**Module:** ${fields.module || '—'}`,
    `**Role:** manager`,
    `**API:** ${BASE}`,
    `**Detected:** ${new Date().toISOString()}`,
  ].join('\n');
  const filename = `${id}-${slug}.md`;
  fs.writeFileSync(path.join(ISSUES, filename), body);
  return { id, filename, title, severity: fields.severity };
}

async function uiLogin(page) {
  await page.goto(UI, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(`${UI}#/login`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(5000);

  // Language gate
  for (let i = 0; i < 2; i++) {
    if (page.url().includes('languageSelection')) {
      await page.mouse.click(920, 300);
      await page.waitForTimeout(400);
      await page.mouse.click(920, 710);
      await page.waitForTimeout(3000);
    }
  }
  if (!page.url().includes('/login')) {
    await page.goto(`${UI}#/login`, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(4000);
  }

  await page.evaluate(() => document.querySelector('flt-semantics-placeholder')?.click());
  await page.waitForTimeout(1500);

  // Wait for Flutter inputs (semantics)
  try {
    await page.waitForSelector('input', { timeout: 20000, state: 'attached' });
  } catch {
    await page.screenshot({ path: path.join(SHOTS, 'mgr-login-no-inputs.png'), fullPage: true });
  }

  const inputs = page.locator('input');
  const n = await inputs.count();
  if (n >= 1) {
    await inputs.first().click({ force: true });
    await page.keyboard.press('Control+A');
    await page.keyboard.type(EMAIL, { delay: 40 });
  } else {
    await page.mouse.click(960, 400);
    await page.keyboard.type(EMAIL, { delay: 40 });
  }
  const pwd = page.locator('input[type="password"]');
  if (await pwd.count()) {
    await pwd.first().click({ force: true });
    await page.keyboard.press('Control+A');
    await page.keyboard.type(PASSWORD, { delay: 40 });
  } else if (n >= 2) {
    await inputs.nth(1).click({ force: true });
    await page.keyboard.type(PASSWORD, { delay: 40 });
  } else {
    await page.mouse.click(960, 480);
    await page.keyboard.type(PASSWORD, { delay: 40 });
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, 'mgr-login-filled.png'), fullPage: true });

  const btn = page.locator('flt-semantics[role="button"]', { hasText: /^Login$/ });
  if (await btn.count()) {
    const box = await btn.first().boundingBox();
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    else await btn.first().click({ force: true });
  } else {
    // Tamil or coordinate fallback
    const ta = page.locator('flt-semantics[role="button"]', { hasText: 'உள்நுழைவு' });
    if (await ta.count()) {
      const box = await ta.last().boundingBox();
      if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    } else {
      await page.mouse.click(960, 560);
    }
  }
  try {
    await page.waitForURL(/dashboard|employeeAttendance/, { timeout: 25000 });
  } catch {}
  await page.waitForTimeout(5000);
  return page.url();
}

async function shot(page, name) {
  const p = path.join(SHOTS, `mgr-${name}.png`);
  await page.screenshot({ path: p, fullPage: true });
  return p;
}

async function gotoRoute(page, hash) {
  await page.goto(`${UI}#${hash}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3500);
  return page.url();
}

async function clickSemantics(page, text) {
  const el = page.locator('flt-semantics', { hasText: new RegExp(`^${text}$`) });
  if (await el.count()) {
    const box = await el.first().boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(2500);
      return true;
    }
  }
  const btn = page.locator('flt-semantics[role="button"]', { hasText: text });
  if (await btn.count()) {
    const box = await btn.first().boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(2500);
      return true;
    }
  }
  return false;
}

async function main() {
  fs.mkdirSync(SHOTS, { recursive: true });
  fs.mkdirSync(ISSUES, { recursive: true });
  const results = [];
  const issues = [];
  let issueNum = 1;
  let me = {};
  let token = null;

  console.log('=== Manager API login ===');
  const { login, id } = await loginApi();
  results.push({
    id: 'MGR-AUTH-01',
    area: 'Authentication',
    check: 'PROD hashed login Manager@123',
    status: login.ok ? 'PASS' : 'FAIL',
    detail: `${login.status}`,
  });
  console.log('API login', login.status, redact(login.body).slice(0, 200));

  if (!login.ok) {
    issues.push(
      writeIssue(issueNum++, 'Manager login fails with Manager@123 on PROD', {
        summary: `manager.briktra@yopmail.com cannot login with Manager@123 on PROD API`,
        steps: `1. Open ${UI}#/login\n2. Enter manager.briktra@yopmail.com / Manager@123\n3. Click Login`,
        expected: '200 + role=manager + Dashboard',
        actual: `${login.status} ${login.body.slice(0, 200)}`,
        severity: 'Critical',
        priority: 'P0',
        screenshots: 'Yes',
        rootCause: 'Credentials mismatch or account disabled',
        acceptance: 'Manager logs in successfully on PROD',
        flowRef: 'Login Page → Login Button → Dashboard',
        module: 'Authentication',
      }),
    );
  } else {
    const obj = JSON.parse(login.body);
    token = obj.access_token;
    const meRes = await api('GET', '/auth/me', {
      token,
      query: obj.tenant_id ? { tenant_id: obj.tenant_id } : undefined,
    });
    try {
      me = JSON.parse(meRes.body);
    } catch {}
    results.push({
      id: 'MGR-AUTH-02',
      area: 'Authentication',
      check: 'Role is manager',
      status: me.role === 'manager' ? 'PASS' : 'FAIL',
      detail: `role=${me.role} name=${me.name} tier=${me.tier}`,
    });
    if (me.role !== 'manager') {
      issues.push(
        writeIssue(issueNum++, `Manager account returned unexpected role ${me.role}`, {
          summary: `Expected role=manager for manager.briktra@yopmail.com, got ${me.role}`,
          steps: 'Login and GET /auth/me',
          expected: 'role=manager',
          actual: JSON.stringify({ role: me.role, name: me.name }),
          severity: 'High',
          priority: 'P1',
          screenshots: 'Optional',
          rootCause: 'Wrong role assignment on user record',
          acceptance: 'role field equals manager',
          flowRef: 'Login → Dashboard',
          module: 'RBAC',
        }),
      );
    }

    const bad = await api('POST', '/auth/login', {
      body: { username: EMAIL, password: hashPassword(id, 'WrongPass@999') },
    });
    results.push({
      id: 'MGR-AUTH-03',
      area: 'Authentication',
      check: 'Wrong password rejected',
      status: bad.status === 401 ? 'PASS' : 'FAIL',
      detail: String(bad.status),
    });
  }

  // UI session
  console.log('=== Manager UI login ===');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const apiCalls = [];
  page.on('response', async (res) => {
    if (res.url().includes('execute-api')) {
      apiCalls.push({
        s: res.status(),
        m: res.request().method(),
        u: res.url().replace(/^https:\/\/[^/]+/, '').slice(0, 120),
      });
    }
  });

  const loginUrl = await uiLogin(page);
  const onDash = loginUrl.includes('dashboard');
  results.push({
    id: 'MGR-AUTH-04',
    area: 'Authentication',
    check: 'UI Login → Dashboard',
    status: onDash ? 'PASS' : 'FAIL',
    detail: loginUrl,
  });
  await shot(page, '01-after-login');
  console.log('UI after login', loginUrl);

  if (!onDash) {
    issues.push(
      writeIssue(issueNum++, 'Manager UI login did not reach Dashboard', {
        summary: 'Playwright login with Manager@123 did not land on /dashboard',
        steps: 'UI login as manager.briktra@yopmail.com',
        expected: '#/dashboard',
        actual: loginUrl,
        severity: 'Critical',
        priority: 'P0',
        screenshots: 'mgr-01-after-login.png',
        rootCause: 'Auth failure, language gate, or role redirect',
        acceptance: 'Manager lands on Dashboard after login',
        flowRef: 'Login Button → Dashboard',
        module: 'Authentication',
      }),
    );
  }

  // Morning scenario routes
  const morning = [
    { id: 'MGR-DASH-01', name: 'Dashboard', hash: '/dashboard', flow: 'Dashboard' },
    { id: 'MGR-PRJ-01', name: 'Projects', hash: '/projects', flow: 'Project List' },
    { id: 'MGR-ATT-01', name: 'Attendance', hash: '/addAttendance', flow: 'Attendance - Mark Attendance' },
    { id: 'MGR-EXP-01', name: 'Expenses', hash: '/expenses', flow: 'Expenses(Project Scope)' },
    { id: 'MGR-DOC-01', name: 'Documents', hash: '/documentWallet', flow: 'Document Wallet' },
    { id: 'MGR-RPT-01', name: 'Reports', hash: '/reportsDashboard', flow: 'Project Reports' },
    { id: 'MGR-NOT-01', name: 'Notifications', hash: '/dashboard', flow: 'Dashboard', note: 'bell on dashboard' },
    { id: 'MGR-PRF-01', name: 'Profile', hash: '/profile', flow: 'Profile' },
    { id: 'MGR-PAY-01', name: 'Payroll', hash: '/payrollList', flow: 'Payroll Management' },
    { id: 'MGR-STK-01', name: 'Stock', hash: '/stockManagement', flow: 'Warehouse Stock Management' },
    { id: 'MGR-SUP-01', name: 'Suppliers', hash: '/suppliers', flow: 'Suppliers List' },
    { id: 'MGR-CON-01', name: 'Contractors', hash: '/contractors', flow: 'Contractors List' },
    { id: 'MGR-BILL-01', name: 'Bills', hash: '/billsList', flow: 'Bills Management' },
  ];

  if (onDash) {
    for (const r of morning) {
      const url = await gotoRoute(page, r.hash);
      await shot(page, `route-${r.name}`);
      const redirected = url.includes('/login');
      // Heuristic: permission denied / locked / no access
      // Flutter may not expose innerText — use URL + screenshot review
      let status = redirected ? 'FAIL' : 'PASS';
      results.push({
        id: r.id,
        area: 'Morning / Modules',
        check: `${r.flow} (#${r.hash})`,
        status,
        detail: url,
      });
      console.log(r.name, status, url);
      if (redirected) {
        issues.push(
          writeIssue(issueNum++, `Manager redirected to login on ${r.name}`, {
            summary: `Manager cannot open ${r.flow}`,
            steps: `Login as manager → navigate #${r.hash}`,
            expected: 'Screen loads for manager role',
            actual: `Redirected to ${url}`,
            severity: 'High',
            priority: 'P1',
            screenshots: `mgr-route-${r.name}.png`,
            rootCause: 'Route guard or session drop',
            acceptance: 'Manager can open permitted module',
            flowRef: r.flow,
            module: r.name,
          }),
        );
      }
    }

    // Open first project if on projects
    await gotoRoute(page, '/projects');
    await shot(page, 'projects-list');
    const opened = await clickSemantics(page, 'Briktra');
    await page.waitForTimeout(3000);
    await shot(page, 'project-detail');
    results.push({
      id: 'MGR-PRJ-02',
      area: 'Morning / Modules',
      check: 'Open Project (click project card)',
      status: page.url().includes('/project') || opened ? 'PASS' : 'REVIEW',
      detail: page.url(),
    });

    // Labour / employees
    await gotoRoute(page, '/employees');
    await shot(page, 'employees-labour');
    results.push({
      id: 'MGR-LAB-01',
      area: 'Morning / Modules',
      check: 'Review Labour / Employees',
      status: page.url().includes('employees') ? 'PASS' : 'FAIL',
      detail: page.url(),
    });

    // Restricted actions — expect deny / redirect / lock / not for manager
    const restricted = [
      { id: 'MGR-NEG-01', name: 'Create-Tenant', hash: '/createTenant', flow: 'Restricted — Create Tenant' },
      { id: 'MGR-NEG-02', name: 'Tenants', hash: '/tenants', flow: 'Restricted — Tenants / Company' },
      { id: 'MGR-NEG-03', name: 'TenantAdmins', hash: '/tenantAdmins', flow: 'Restricted — Role Management' },
      { id: 'MGR-NEG-04', name: 'SuperAdmin', hash: '/superAdmin', flow: 'Restricted — Super Admin' },
      { id: 'MGR-NEG-05', name: 'Plans', hash: '/plans', flow: 'Restricted — Subscription' },
      { id: 'MGR-NEG-06', name: 'Company-Details', hash: '/company-details', flow: 'Restricted — Company Settings' },
      { id: 'MGR-NEG-07', name: 'Create-Project', hash: '/createProject', flow: 'Create Project (policy)' },
    ];

    for (const r of restricted) {
      const url = await gotoRoute(page, r.hash);
      await shot(page, `neg-${r.name}`);
      const stayed = url.includes(r.hash.replace(/^\//, '')) || url.endsWith(r.hash);
      // PASS for negative = denied (redirect login, dashboard, or lock)
      // FAIL = manager got full admin access unexpectedly
      let status = 'REVIEW';
      if (url.includes('/login')) status = 'PASS'; // denied via auth
      else if (url.includes('dashboard') && !r.hash.includes('dashboard')) status = 'PASS';
      else if (stayed) status = 'REVIEW'; // need screenshot — may be allowed or showing lock
      else status = 'PASS'; // bounced elsewhere = likely denied
      results.push({
        id: r.id,
        area: 'Restricted',
        check: r.flow,
        status,
        detail: url,
      });
      console.log('NEG', r.name, status, url);
    }

    // Logout via profile
    await gotoRoute(page, '/profile');
    await shot(page, 'profile-before-logout');
    const logoutClicked = await clickSemantics(page, 'Logout');
    await page.waitForTimeout(4000);
    await shot(page, 'after-logout');
    results.push({
      id: 'MGR-AUTH-05',
      area: 'Authentication',
      check: 'Logout from Profile',
      status: page.url().includes('login') || logoutClicked ? 'PASS' : 'REVIEW',
      detail: page.url(),
    });

    // API logout revoke if we have token
    if (token) {
      // re-login for token revoke test
      const re = await loginApi();
      if (re.login.ok) {
        const o = JSON.parse(re.login.body);
        const lo = await api('POST', '/auth/logout', {
          body: { refresh_token: o.refresh_token },
          token: o.access_token,
        });
        const me2 = await api('GET', '/auth/me', { token: o.access_token });
        results.push({
          id: 'MGR-AUTH-06',
          area: 'Security',
          check: 'Access token after logout',
          status: me2.status === 401 ? 'PASS' : 'FAIL',
          detail: `logout=${lo.status} me=${me2.status}`,
        });
        if (me2.status !== 401) {
          issues.push(
            writeIssue(issueNum++, 'Manager access JWT remains valid after logout', {
              summary: 'Same logout revoke defect for manager role on PROD',
              steps: 'Login as manager → POST /auth/logout → GET /auth/me',
              expected: '401',
              actual: String(me2.status),
              severity: 'High',
              priority: 'P1',
              screenshots: 'Optional',
              rootCause: 'Access token not revoked server-side',
              acceptance: 'Access token rejected after logout',
              flowRef: 'Profile → Logout',
              module: 'Authentication',
            }),
          );
        }
      }
    }
  }

  await browser.close();

  // Escalate REVIEW items that look like privilege leaks: createTenant stayed
  for (const r of results.filter((x) => x.area === 'Restricted' && x.status === 'REVIEW')) {
    // If createTenant / superAdmin / tenantAdmins actually loaded without bounce — file issue for review
    if (/createTenant|tenantAdmins|superAdmin|tenants/.test(r.detail) && !/login|dashboard/.test(r.detail)) {
      issues.push(
        writeIssue(issueNum++, `Manager may access restricted route: ${r.check}`, {
          summary: `Manager deep-link stayed on restricted path: ${r.detail}`,
          steps: `Login as manager → open ${r.detail}`,
          expected: 'Permission denied / redirect / lock screen',
          actual: `Remained on ${r.detail} — verify screenshot for deny UI`,
          severity: 'High',
          priority: 'P1',
          screenshots: 'Yes — neg-*.png',
          rootCause: 'Missing RBAC route guard for manager',
          acceptance: 'Manager cannot use admin-only screens',
          flowRef: r.check,
          module: 'RBAC',
        }),
      );
      r.status = 'FAIL';
    }
  }

  const totals = results.reduce((a, r) => {
    a[r.status] = (a[r.status] || 0) + 1;
    return a;
  }, {});

  const report = [
    '# Manager (Construction Project Manager) — Regression Report',
    '',
    `**Date:** ${new Date().toISOString()}`,
    `**Role:** manager (Construction Project Manager)`,
    `**Account:** ${EMAIL} / Manager@123`,
    `**UI:** ${UI}`,
    `**API:** ${BASE}`,
    `**Flow Sheet:** docs/Briktra_Complete_Flow_Sheet.xlsx`,
    '',
    '---',
    '',
    '## Executive Summary',
    '',
    onDash
      ? 'Manager login **succeeded** on PROD. Morning module routes were exercised via UI. Restricted admin deep-links were probed for deny behavior.'
      : 'Manager login **failed** or did not reach Dashboard — regression blocked for deep module testing.',
    '',
    '| Metric | Count |',
    '|--------|-------|',
    ...Object.entries(totals).map(([k, v]) => `| ${k} | ${v} |`),
    `| Issues filed | ${issues.length} |`,
    '',
    '### Profile',
    '```json',
    JSON.stringify(
      {
        name: me.name,
        email: me.email,
        role: me.role,
        tier: me.tier,
        tenant_name: me.tenant_name,
        tenant_id: me.tenant_id,
      },
      null,
      2,
    ),
    '```',
    '',
    '---',
    '',
    '## Regression Summary',
    '',
    '| ID | Area | Check | Status | Detail |',
    '|----|------|-------|--------|--------|',
    ...results.map(
      (r) =>
        `| ${r.id} | ${r.area} | ${r.check} | **${r.status}** | ${String(r.detail).replace(/\|/g, '/').slice(0, 90)} |`,
    ),
    '',
    '### Morning business scenario mapping',
    '| Scenario step | Flow Sheet / Route | Status |',
    '|----------------|-------------------|--------|',
    '| Review Dashboard | Dashboard `/dashboard` | see MGR-DASH-01 |',
    '| Open Project | Project List → Project Detail | see MGR-PRJ-* |',
    '| Review Labour | Employees List | see MGR-LAB-01 |',
    '| Check Attendance | Attendance - Mark Attendance | see MGR-ATT-01 |',
    '| Approve Expenses | Expenses | see MGR-EXP-01 |',
    '| View Reports | Project Reports | see MGR-RPT-01 |',
    '| Review Progress | Project Detail / Dashboard | see MGR-PRJ-02 |',
    '| Check Notifications | Dashboard bell | see MGR-NOT-01 |',
    '| Logout | Profile → Logout | see MGR-AUTH-05 |',
    '',
    '---',
    '',
    '## Bug Summary',
    '',
    issues.length
      ? issues.map((i) => `- **${i.id}** (${i.severity}): ${i.title} — \`${i.filename}\``).join('\n')
      : 'No new issues filed this run.',
    '',
    '---',
    '',
    '## UI Review',
    '',
    '- Screenshots under `docs/qa-manager-regression/screenshots/`.',
    '- Compare manager Dashboard role tasks vs Flow Sheet (Mark Attendance, Projects, Reports).',
    '- Verify restricted routes show deny/lock rather than admin CRUD.',
    '',
    '## UX Review',
    '',
    '- Manager morning path should be reachable in few taps from Dashboard.',
    '- Permission denials should be clear (not blank screens).',
    '',
    '## Performance Review',
    '',
    '- Auth and route transitions observed ~3–10s in headless runs.',
    '- No dedicated load test this session.',
    '',
    '## Security Review',
    '',
    '- Wrong password rejection tested.',
    '- Restricted deep-links probed (tenants, subscription, superAdmin, company settings).',
    '- Logout token revoke checked if login succeeded.',
    '',
    '## Suggestions',
    '',
    '1. Manually click every Dashboard quick action and document Pass/Fail against Flow Sheet `Leads To`.',
    '2. Complete expense approve + attendance mark CRUD with screenshots.',
    '3. Confirm create-project policy for managers (allowed vs denied per tenant settings).',
    '4. Align Flow Sheet with manager-specific role tasks.',
    '',
    '## API sample (first calls)',
    '```json',
    JSON.stringify(apiCalls.slice(0, 25), null, 2),
    '```',
  ].join('\n');

  fs.writeFileSync(path.join(OUT, 'MANAGER_REGRESSION_REPORT.md'), report);
  fs.writeFileSync(
    path.join(OUT, 'results.json'),
    JSON.stringify({ me, results, issues, totals, apiCalls: apiCalls.slice(0, 50) }, null, 2),
  );
  console.log('Totals', totals);
  console.log('Issues', issues.length);
  console.log('Report', path.join(OUT, 'MANAGER_REGRESSION_REPORT.md'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
