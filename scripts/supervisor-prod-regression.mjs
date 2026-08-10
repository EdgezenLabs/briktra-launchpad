/**
 * Supervisor (Site Supervisor) PROD regression — Flow Sheet + site scenario.
 * Login: supervisior.briktra@yopmail.com / Supervisior@123
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
const EMAIL = 'supervisior.briktra@yopmail.com';
const PASSWORD = 'Supervisior@123';
const OUT = path.join(ROOT, 'docs', 'qa-supervisor-regression');
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
  const id = `SUP-ISSUE-${String(num).padStart(3, '0')}`;
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
    `**Role:** supervisor`,
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
  try {
    await page.waitForSelector('input', { timeout: 20000, state: 'attached' });
  } catch {
    await page.screenshot({ path: path.join(SHOTS, 'sup-login-no-inputs.png'), fullPage: true });
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
  await page.screenshot({ path: path.join(SHOTS, 'sup-login-filled.png'), fullPage: true });

  const btn = page.locator('flt-semantics[role="button"]', { hasText: /^Login$/ });
  if (await btn.count()) {
    const box = await btn.first().boundingBox();
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    else await btn.first().click({ force: true });
  } else {
    await page.mouse.click(960, 560);
  }
  try {
    await page.waitForURL(/dashboard|employeeAttendance/, { timeout: 25000 });
  } catch {}
  await page.waitForTimeout(5000);
  return page.url();
}

async function shot(page, name) {
  const p = path.join(SHOTS, `sup-${name}.png`);
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

  console.log('=== Supervisor API login ===');
  const { login, id } = await loginApi();
  results.push({
    id: 'SUP-AUTH-01',
    area: 'Authentication',
    check: 'PROD hashed login Supervisior@123',
    status: login.ok ? 'PASS' : 'FAIL',
    detail: String(login.status),
  });
  console.log('API login', login.status, redact(login.body).slice(0, 220));

  if (!login.ok) {
    issues.push(
      writeIssue(issueNum++, 'Supervisor login fails with Supervisior@123 on PROD', {
        summary: `${EMAIL} cannot login with provided password on PROD`,
        steps: `1. Open ${UI}#/login\n2. Enter ${EMAIL} / Supervisior@123\n3. Login`,
        expected: '200 + role=supervisor + Dashboard',
        actual: `${login.status} ${login.body.slice(0, 200)}`,
        severity: 'Critical',
        priority: 'P0',
        screenshots: 'Yes',
        rootCause: 'Credentials mismatch or account disabled',
        acceptance: 'Supervisor logs in on PROD',
        flowRef: 'Login Page → Dashboard',
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
      id: 'SUP-AUTH-02',
      area: 'Authentication',
      check: 'Role is supervisor',
      status: me.role === 'supervisor' ? 'PASS' : 'FAIL',
      detail: `role=${me.role} name=${me.name}`,
    });
    if (me.role !== 'supervisor') {
      issues.push(
        writeIssue(issueNum++, `Supervisor account returned unexpected role ${me.role}`, {
          summary: `Expected role=supervisor, got ${me.role}`,
          steps: 'Login and GET /auth/me',
          expected: 'role=supervisor',
          actual: JSON.stringify({ role: me.role, name: me.name }),
          severity: 'High',
          priority: 'P1',
          screenshots: 'Optional',
          rootCause: 'Wrong role assignment',
          acceptance: 'role equals supervisor',
          flowRef: 'Login → Dashboard',
          module: 'RBAC',
        }),
      );
    }
    const bad = await api('POST', '/auth/login', {
      body: { username: EMAIL, password: hashPassword(id, 'WrongPass@999') },
    });
    results.push({
      id: 'SUP-AUTH-03',
      area: 'Authentication',
      check: 'Wrong password rejected',
      status: bad.status === 401 ? 'PASS' : 'FAIL',
      detail: String(bad.status),
    });
  }

  console.log('=== Supervisor UI login ===');
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
    id: 'SUP-AUTH-04',
    area: 'Authentication',
    check: 'UI Login → Dashboard',
    status: onDash ? 'PASS' : 'FAIL',
    detail: loginUrl,
  });
  await shot(page, '01-after-login');
  console.log('UI after login', loginUrl);

  if (!onDash) {
    issues.push(
      writeIssue(issueNum++, 'Supervisor UI login did not reach Dashboard', {
        summary: 'Playwright login did not land on /dashboard',
        steps: `UI login as ${EMAIL}`,
        expected: '#/dashboard',
        actual: loginUrl,
        severity: 'Critical',
        priority: 'P0',
        screenshots: 'sup-01-after-login.png',
        rootCause: 'Auth failure or role redirect',
        acceptance: 'Supervisor lands on Dashboard',
        flowRef: 'Login Button → Dashboard',
        module: 'Authentication',
      }),
    );
  }

  // Site scenario / verify modules
  const siteRoutes = [
    { id: 'SUP-ATT-01', name: 'Attendance', hash: '/addAttendance', flow: 'Attendance - Mark Attendance' },
    { id: 'SUP-EMP-01', name: 'Labour-Employees', hash: '/employees', flow: 'Employees List / Add Labour' },
    { id: 'SUP-DOC-01', name: 'Documents', hash: '/documentWallet', flow: 'Document Wallet / Upload Photos' },
    { id: 'SUP-NOTE-01', name: 'Daily-Notes', hash: '/dailyNotes', flow: 'Daily Notes / Daily Progress' },
    { id: 'SUP-UPD-01', name: 'Daily-Updates', hash: '/dailyUpdates', flow: 'Daily Updates' },
    { id: 'SUP-EXP-01', name: 'Expenses', hash: '/expenses', flow: 'Expenses / Create Expense' },
    { id: 'SUP-BILL-01', name: 'Bills', hash: '/billsList', flow: 'Bills Management / Upload Bills' },
    { id: 'SUP-PRJ-01', name: 'Projects', hash: '/projects', flow: 'Project List / Assigned Project' },
    { id: 'SUP-SITE-01', name: 'Project-Detail', hash: '/project', flow: 'Site Details / Project Detail' },
    { id: 'SUP-NOT-01', name: 'Notifications', hash: '/dashboard', flow: 'Dashboard notifications' },
    { id: 'SUP-PRF-01', name: 'Profile', hash: '/profile', flow: 'Profile' },
    { id: 'SUP-RPT-01', name: 'Reports', hash: '/reportsDashboard', flow: 'Project Reports' },
    { id: 'SUP-STK-01', name: 'Stock', hash: '/stockManagement', flow: 'Warehouse Stock' },
    { id: 'SUP-CON-01', name: 'Contractors', hash: '/contractors', flow: 'Contractors List' },
    { id: 'SUP-SUP-01', name: 'Suppliers', hash: '/suppliers', flow: 'Suppliers List' },
  ];

  if (onDash) {
    for (const r of siteRoutes) {
      const url = await gotoRoute(page, r.hash);
      await shot(page, `route-${r.name}`);
      const redirected = url.includes('/login');
      const wrongTarget =
        r.hash === '/expenses' && url.includes('addAttendance')
          ? true
          : r.hash === '/dailyNotes' && !url.includes('daily') && !url.includes('Daily')
            ? false
            : false;
      let status = redirected ? 'FAIL' : 'PASS';
      if (r.hash === '/expenses' && url.includes('addAttendance')) {
        status = 'FAIL';
        issues.push(
          writeIssue(issueNum++, 'Supervisor #/expenses redirects to Attendance', {
            summary: 'Deep link /expenses lands on addAttendance instead of expenses workflow',
            steps: `Login as supervisor → open #/expenses`,
            expected: 'Expenses module per Flow Sheet',
            actual: url,
            severity: 'High',
            priority: 'P1',
            screenshots: `sup-route-${r.name}.png`,
            rootCause: 'Unregistered or remapped expenses route',
            acceptance: 'Supervisor can open expenses / create expense path',
            flowRef: r.flow,
            module: 'Expenses',
          }),
        );
      }
      results.push({
        id: r.id,
        area: 'Site scenario / Modules',
        check: `${r.flow} (#${r.hash})`,
        status,
        detail: url,
      });
      console.log(r.name, status, url);
      if (redirected) {
        issues.push(
          writeIssue(issueNum++, `Supervisor redirected to login on ${r.name}`, {
            summary: `Cannot open ${r.flow}`,
            steps: `Login → #${r.hash}`,
            expected: 'Screen loads',
            actual: url,
            severity: 'High',
            priority: 'P1',
            screenshots: `sup-route-${r.name}.png`,
            rootCause: 'Route guard or session drop',
            acceptance: 'Supervisor can open permitted module',
            flowRef: r.flow,
            module: r.name,
          }),
        );
      }
    }

    // Open assigned project
    await gotoRoute(page, '/projects');
    await shot(page, 'projects-list');
    const opened = await clickSemantics(page, 'Briktra');
    await page.waitForTimeout(3000);
    await shot(page, 'project-detail');
    results.push({
      id: 'SUP-PRJ-02',
      area: 'Site scenario / Modules',
      check: 'View Assigned Project (open card)',
      status: page.url().includes('/project') || opened ? 'PASS' : 'REVIEW',
      detail: page.url(),
    });

    // Restricted — expect DENY
    const restricted = [
      { id: 'SUP-NEG-01', name: 'Create-Project', hash: '/createProject', expect: 'deny', label: 'Delete/Create Project' },
      { id: 'SUP-NEG-02', name: 'Create-Tenant', hash: '/createTenant', expect: 'deny', label: 'Delete Company / Create Tenant' },
      { id: 'SUP-NEG-03', name: 'Tenants', hash: '/tenants', expect: 'deny', label: 'Manage Tenants' },
      { id: 'SUP-NEG-04', name: 'TenantAdmins', hash: '/tenantAdmins', expect: 'deny', label: 'Manage Users / Role Mgmt' },
      { id: 'SUP-NEG-05', name: 'SuperAdmin', hash: '/superAdmin', expect: 'deny', label: 'Super Admin' },
      { id: 'SUP-NEG-06', name: 'Plans', hash: '/plans', expect: 'deny', label: 'Manage Subscription' },
      { id: 'SUP-NEG-07', name: 'Company-Details', hash: '/company-details', expect: 'deny', label: 'Delete/Edit Company' },
      { id: 'SUP-NEG-08', name: 'Employees-Admin', hash: '/employees', expect: 'policy', label: 'Manage Users (employees)' },
    ];

    for (const r of restricted) {
      const url = await gotoRoute(page, r.hash);
      await shot(page, `neg-${r.name}`);
      const hashKey = r.hash.replace(/^\//, '');
      const stayed = url.includes(hashKey);
      let status = 'REVIEW';
      if (url.includes('/login')) status = 'PASS';
      else if (url.includes('dashboard') && !r.hash.includes('dashboard')) status = 'PASS';
      else if (stayed && r.expect === 'deny') {
        // likely privilege leak — confirm via screenshot review later; mark FAIL for admin routes
        if (
          /createTenant|tenantAdmins|superAdmin|plans|company-details|createProject|tenants/.test(
            r.hash,
          )
        ) {
          status = 'FAIL';
        } else {
          status = 'REVIEW';
        }
      } else if (r.expect === 'policy') {
        status = stayed ? 'REVIEW' : 'PASS';
      } else {
        status = 'PASS';
      }
      results.push({
        id: r.id,
        area: 'Restricted',
        check: r.label,
        status,
        detail: url,
      });
      console.log('NEG', r.name, status, url);

      if (status === 'FAIL') {
        issues.push(
          writeIssue(issueNum++, `Supervisor can access restricted route: ${r.label}`, {
            summary: `Supervisor deep-link stayed on ${url} for restricted action "${r.label}"`,
            steps: `1. Login as supervisor\n2. Open ${UI}#${r.hash}\n3. Observe UI`,
            expected: 'Permission denied / redirect / lock — no admin CRUD',
            actual: `Remained on ${url} — see screenshot for full admin UI vs deny`,
            severity: /createTenant|tenantAdmins|superAdmin/.test(r.hash) ? 'Critical' : 'High',
            priority: /createTenant|tenantAdmins|superAdmin/.test(r.hash) ? 'P0' : 'P1',
            screenshots: `Yes — sup-neg-${r.name}.png`,
            rootCause: 'Missing RBAC route guard for supervisor',
            acceptance: 'Supervisor cannot use admin-only screens',
            flowRef: `Restricted — ${r.label}`,
            module: 'RBAC',
          }),
        );
      }
    }

    // Logout
    await gotoRoute(page, '/profile');
    await shot(page, 'profile-before-logout');
    const logoutClicked = await clickSemantics(page, 'Logout');
    await page.waitForTimeout(4000);
    await shot(page, 'after-logout');
    results.push({
      id: 'SUP-AUTH-05',
      area: 'Authentication',
      check: 'Logout from Profile',
      status: page.url().includes('login') || logoutClicked ? 'PASS' : 'REVIEW',
      detail: page.url(),
    });

    if (token) {
      const re = await loginApi();
      if (re.login.ok) {
        const o = JSON.parse(re.login.body);
        const lo = await api('POST', '/auth/logout', {
          body: { refresh_token: o.refresh_token },
          token: o.access_token,
        });
        const me2 = await api('GET', '/auth/me', { token: o.access_token });
        results.push({
          id: 'SUP-AUTH-06',
          area: 'Security',
          check: 'Access token after logout',
          status: me2.status === 401 ? 'PASS' : 'FAIL',
          detail: `logout=${lo.status} me=${me2.status}`,
        });
        if (me2.status !== 401) {
          issues.push(
            writeIssue(issueNum++, 'Supervisor access JWT remains valid after logout', {
              summary: 'Logout does not revoke access token for supervisor on PROD',
              steps: 'Login → POST /auth/logout → GET /auth/me',
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

  const totals = results.reduce((a, r) => {
    a[r.status] = (a[r.status] || 0) + 1;
    return a;
  }, {});

  const report = [
    '# Supervisor (Site Supervisor) — Complete Regression Report',
    '',
    `**Date:** ${new Date().toISOString()}`,
    `**Role:** supervisor (Site Supervisor)`,
    `**Account:** ${EMAIL} / Supervisior@123`,
    `**UI:** ${UI}`,
    `**API:** ${BASE}`,
    `**Flow Sheet:** docs/Briktra_Complete_Flow_Sheet.xlsx`,
    `**Script:** scripts/supervisor-prod-regression.mjs`,
    '',
    '---',
    '',
    '## Executive Summary',
    '',
    onDash
      ? 'Supervisor login **succeeded** on PROD. Site scenario modules were smoke-tested. Restricted admin deep-links were probed for deny behavior — screenshot review required for FAIL items.'
      : 'Supervisor login **failed** to reach Dashboard — deep testing blocked.',
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
    '### Site business scenario mapping',
    '| Scenario step | Flow Sheet / Route | Status |',
    '|----------------|-------------------|--------|',
    '| Arrive at Site / Dashboard | Dashboard | see SUP-AUTH-04 |',
    '| Mark Attendance | Attendance | see SUP-ATT-01 |',
    '| Add Labour | Employees / Add Labour | see SUP-EMP-01 |',
    '| Upload Photos | Document Wallet | see SUP-DOC-01 |',
    '| Submit Daily Progress | Daily Notes / Updates | see SUP-NOTE-01 / SUP-UPD-01 |',
    '| Create Expense | Expenses | see SUP-EXP-01 |',
    '| Upload Bills | Bills Management | see SUP-BILL-01 |',
    '| View Assigned Project | Project List / Detail | see SUP-PRJ-* |',
    '| Logout | Profile → Logout | see SUP-AUTH-05 |',
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
    '- Screenshots: `docs/qa-supervisor-regression/screenshots/sup-*.png`',
    '- Compare Dashboard role tasks: expect Log Expense + My Projects (not Tenant New Project / Team).',
    '- Restricted routes must show deny — not admin chrome.',
    '',
    '## UX Review',
    '',
    '- Site morning path should be reachable from Dashboard quick actions.',
    '- Permission denials should be clear (no Super Admin welcome / Create Tenant forms).',
    '',
    '## Performance Review',
    '',
    '- Auth and route transitions observed ~3–10s headless.',
    '- No dedicated load test.',
    '',
    '## Security Review',
    '',
    '- Wrong password rejection tested.',
    '- Restricted deep-links probed (create project/tenant, subscription, users, company).',
    '- Logout token revoke checked when login succeeded.',
    '',
    '## Suggestions',
    '',
    '1. Gate admin routes for supervisor the same as manager hardening (createTenant, tenantAdmins, superAdmin, plans, company-details).',
    '2. Fix `/expenses` routing if it remaps to attendance.',
    '3. Complete Flow Sheet clicks: Add Labour modal, photo upload, daily progress submit, expense create.',
    '4. Confirm create-project policy for supervisors.',
    '',
    '## API sample',
    '```json',
    JSON.stringify(apiCalls.slice(0, 25), null, 2),
    '```',
  ].join('\n');

  fs.writeFileSync(path.join(OUT, 'SUPERVISOR_REGRESSION_REPORT.md'), report);
  fs.writeFileSync(
    path.join(OUT, 'results.json'),
    JSON.stringify({ me, results, issues, totals, apiCalls: apiCalls.slice(0, 50) }, null, 2),
  );
  console.log('Totals', totals);
  console.log('Issues', issues.length);
  console.log('Report', path.join(OUT, 'SUPERVISOR_REGRESSION_REPORT.md'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
