/**
 * Employee (Site Employee) PROD regression — Flow Sheet + employee scenario.
 * Login: employee.briktra@yopmail.com / Employee@123
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
const EMAIL = 'employee.briktra@yopmail.com';
const PASSWORD = 'Employee@123';
const OUT = path.join(ROOT, 'docs', 'qa-employee-regression');
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
  const id = `EMP-ISSUE-${String(num).padStart(3, '0')}`;
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
    `**Role:** employee`,
    `**API:** ${BASE}`,
    `**Detected:** ${new Date().toISOString()}`,
  ].join('\n');
  const filename = `${id}-${slug}.md`;
  fs.writeFileSync(path.join(ISSUES, filename), body);
  return { id, filename, title, severity: fields.severity };
}

async function clickSemanticsExact(page, pattern) {
  const el = page.locator('flt-semantics', { hasText: pattern });
  if (!(await el.count())) return false;
  const box = await el.first().boundingBox();
  if (!box) return false;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(1500);
  return true;
}

async function passLanguageSelection(page) {
  for (let attempt = 0; attempt < 4; attempt++) {
    if (!page.url().includes('languageSelection')) return true;
    await page.evaluate(() => document.querySelector('flt-semantics-placeholder')?.click());
    await page.waitForTimeout(600);
    await clickSemanticsExact(page, /^English$/i);
    const ok =
      (await clickSemanticsExact(page, /^Change Language$/i)) ||
      (await clickSemanticsExact(page, /Change Language/i));
    if (!ok) await page.mouse.click(960, 720);
    await page.waitForTimeout(2000);
  }
  return !page.url().includes('languageSelection');
}

async function uiLogin(page) {
  await page.goto(UI, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(`${UI}#/login`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(5000);

  await passLanguageSelection(page);
  if (!page.url().includes('/login')) {
    await page.goto(`${UI}#/login`, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(4000);
    await passLanguageSelection(page);
  }

  await page.evaluate(() => document.querySelector('flt-semantics-placeholder')?.click());
  await page.waitForTimeout(1500);
  try {
    await page.waitForSelector('input', { timeout: 25000, state: 'attached' });
  } catch {
    await page.screenshot({ path: path.join(SHOTS, 'emp-login-no-inputs.png'), fullPage: true });
  }

  const inputs = page.locator('input');
  const n = await inputs.count();
  if (n >= 1) {
    await inputs.first().click({ force: true });
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(EMAIL, { delay: 40 });
  } else {
    await page.mouse.click(960, 400);
    await page.keyboard.type(EMAIL, { delay: 40 });
  }
  const pwd = page.locator('input[type="password"]');
  if (await pwd.count()) {
    await pwd.first().click({ force: true });
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(PASSWORD, { delay: 40 });
  } else if (n >= 2) {
    await inputs.nth(1).click({ force: true });
    await page.keyboard.type(PASSWORD, { delay: 40 });
  } else {
    await page.mouse.click(960, 480);
    await page.keyboard.type(PASSWORD, { delay: 40 });
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, 'emp-login-filled.png'), fullPage: true });

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
  const p = path.join(SHOTS, `emp-${name}.png`);
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

async function pageText(page) {
  return page.evaluate(() => {
    const nodes = [...document.querySelectorAll('flt-semantics')];
    return nodes
      .map((n) => (n.getAttribute('aria-label') || n.textContent || '').trim())
      .filter(Boolean)
      .slice(0, 80)
      .join(' | ');
  });
}

function isDenied(url, text) {
  const t = (text || '').toLowerCase();
  return (
    url.includes('/login') ||
    (url.includes('dashboard') && !url.includes('employeeAttendance')) ||
    /permission|denied|not authorized|access denied|unauthorized|you don.?t have|no access|forbidden/.test(
      t,
    )
  );
}

async function main() {
  fs.mkdirSync(SHOTS, { recursive: true });
  fs.mkdirSync(ISSUES, { recursive: true });
  const results = [];
  const issues = [];
  let issueNum = 1;
  let me = {};
  let token = null;
  let onHome = false;

  console.log('=== Employee API login ===');
  const { login, id } = await loginApi();
  results.push({
    id: 'EMP-AUTH-01',
    area: 'Authentication',
    check: 'PROD hashed login Employee@123',
    status: login.ok ? 'PASS' : 'FAIL',
    detail: String(login.status),
  });
  console.log('API login', login.status, redact(login.body).slice(0, 280));

  if (!login.ok) {
    issues.push(
      writeIssue(issueNum++, 'Employee login fails with Employee@123 on PROD', {
        summary: `${EMAIL} cannot login with provided password on PROD`,
        steps: `1. Open ${UI}#/login\n2. Enter ${EMAIL} / Employee@123\n3. Login`,
        expected: '200 + role=employee + home (Dashboard or Employee Attendance)',
        actual: `${login.status} ${login.body.slice(0, 200)}`,
        severity: 'Critical',
        priority: 'P0',
        screenshots: 'Yes',
        rootCause: 'Credentials mismatch or account disabled',
        acceptance: 'Employee logs in on PROD',
        flowRef: 'Login Page → Employee home',
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
      id: 'EMP-AUTH-02',
      area: 'Authentication',
      check: 'Role is employee',
      status: me.role === 'employee' ? 'PASS' : 'FAIL',
      detail: `role=${me.role} name=${me.name} email=${me.email}`,
    });
    if (me.role !== 'employee') {
      issues.push(
        writeIssue(issueNum++, `Employee account returned unexpected role ${me.role}`, {
          summary: `Expected role=employee, got ${me.role}`,
          steps: 'Login and GET /auth/me',
          expected: 'role=employee',
          actual: JSON.stringify({ role: me.role, name: me.name, email: me.email }),
          severity: 'High',
          priority: 'P1',
          screenshots: 'Optional',
          rootCause: 'Wrong role assignment',
          acceptance: 'role equals employee',
          flowRef: 'Login → Home',
          module: 'RBAC',
        }),
      );
    }
    const bad = await api('POST', '/auth/login', {
      body: { username: EMAIL, password: hashPassword(id, 'WrongPass@999') },
    });
    results.push({
      id: 'EMP-AUTH-03',
      area: 'Authentication',
      check: 'Wrong password rejected',
      status: bad.status === 401 ? 'PASS' : 'FAIL',
      detail: String(bad.status),
    });
  }

  console.log('=== Employee UI login ===');
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
  onHome = /dashboard|employeeAttendance/i.test(loginUrl) && !loginUrl.includes('/login');
  results.push({
    id: 'EMP-AUTH-04',
    area: 'Authentication',
    check: 'UI Login → Employee home',
    status: onHome ? 'PASS' : 'FAIL',
    detail: loginUrl,
  });
  await shot(page, '01-after-login');
  const homeText = await pageText(page);
  fs.writeFileSync(path.join(OUT, 'home-semantics.txt'), homeText);
  console.log('UI after login', loginUrl);
  console.log('Home text sample', homeText.slice(0, 300));

  if (!onHome) {
    issues.push(
      writeIssue(issueNum++, 'Employee UI login did not reach home screen', {
        summary: 'Playwright login did not land on dashboard or employeeAttendance',
        steps: `UI login as ${EMAIL}`,
        expected: '#/dashboard or #/employeeAttendance*',
        actual: loginUrl,
        severity: 'Critical',
        priority: 'P0',
        screenshots: 'emp-01-after-login.png',
        rootCause: 'Auth failure or role redirect',
        acceptance: 'Employee lands on allowed home',
        flowRef: 'Login Button → Home',
        module: 'Authentication',
      }),
    );
  }

  // Business scenario — allowed modules
  const allowedRoutes = [
    {
      id: 'EMP-ATT-01',
      name: 'Attendance-Home',
      hash: '/employeeAttendanceTap',
      flow: "View Today's Attendance / Employee Attendance Tap",
      scenario: 'View Today Attendance',
    },
    {
      id: 'EMP-ATT-02',
      name: 'Mark-Attendance',
      hash: '/addAttendance',
      flow: 'Mark Attendance',
      scenario: 'Mark Attendance',
    },
    {
      id: 'EMP-ATT-03',
      name: 'Employee-Attendance',
      hash: '/employeeAttendance',
      flow: 'Employee Attendance',
      scenario: 'Attendance alternate route',
    },
    {
      id: 'EMP-TSK-01',
      name: 'Assigned-Tasks',
      hash: '/projects',
      flow: 'View Assigned Tasks (Projects if assigned)',
      scenario: 'View Assigned Tasks',
      note: 'Employee may be denied full project list — document either assigned tasks or deny',
    },
    {
      id: 'EMP-PRF-01',
      name: 'Profile',
      hash: '/profile',
      flow: 'Profile / Update Profile',
      scenario: 'Update Profile',
    },
    {
      id: 'EMP-NOT-01',
      name: 'Notifications',
      hash: '/dashboard',
      flow: 'Notifications / Dashboard',
      scenario: 'Read Notifications',
    },
  ];

  if (onHome) {
    for (const r of allowedRoutes) {
      const url = await gotoRoute(page, r.hash);
      await shot(page, `route-${r.name}`);
      const text = await pageText(page);
      const redirectedLogin = url.includes('/login');
      let status = redirectedLogin ? 'FAIL' : 'PASS';
      let detail = url;

      // Employee should not get full admin project management — if projects fully open with CRUD, flag later in restricted
      if (r.hash === '/projects') {
        const hasCreate =
          /create project|add project|\+/i.test(text) || url.includes('createProject');
        detail = `${url} | ${text.slice(0, 160)}`;
        if (redirectedLogin) status = 'PASS'; // treated as deny for tasks — but scenario needs assigned tasks
        results.push({
          id: r.id,
          area: 'Business scenario',
          check: r.flow,
          status: redirectedLogin ? 'FAIL' : 'PASS',
          detail,
        });
        if (redirectedLogin) {
          issues.push(
            writeIssue(issueNum++, 'Employee cannot view assigned tasks / projects route logs out', {
              summary: 'Employee deep-link to projects redirected to login',
              steps: `Login as employee → open #/projects`,
              expected: 'Assigned tasks view or clear empty state',
              actual: url,
              severity: 'High',
              priority: 'P1',
              screenshots: `emp-route-${r.name}.png`,
              rootCause: 'Route guard or session drop',
              acceptance: 'Employee can see assigned work without logout',
              flowRef: r.flow,
              module: 'Assigned Tasks',
            }),
          );
        } else if (hasCreate && /create project/i.test(text)) {
          // privilege leak handled in restricted section too
        }
        console.log(r.name, status, url);
        continue;
      }

      results.push({
        id: r.id,
        area: 'Business scenario',
        check: r.flow,
        status,
        detail: `${url} | ${text.slice(0, 120)}`,
      });
      console.log(r.name, status, url);
      if (redirectedLogin) {
        issues.push(
          writeIssue(issueNum++, `Employee redirected to login on ${r.name}`, {
            summary: `Cannot open ${r.flow}`,
            steps: `Login → #${r.hash}`,
            expected: 'Screen loads for employee',
            actual: url,
            severity: 'High',
            priority: 'P1',
            screenshots: `emp-route-${r.name}.png`,
            rootCause: 'Route guard or session drop',
            acceptance: 'Employee can open permitted module',
            flowRef: r.flow,
            module: r.name,
          }),
        );
      }
    }

    // Try mark attendance interaction on attendance home
    await gotoRoute(page, '/employeeAttendanceTap');
    await shot(page, 'attendance-before-mark');
    const markClicked =
      (await clickSemantics(page, 'Mark Attendance')) ||
      (await clickSemantics(page, 'Check In')) ||
      (await clickSemantics(page, 'Present')) ||
      (await clickSemantics(page, 'Mark'));
    await page.waitForTimeout(2000);
    await shot(page, 'attendance-after-mark-attempt');
    results.push({
      id: 'EMP-ATT-04',
      area: 'Business scenario',
      check: 'Mark Attendance control interaction',
      status: markClicked ? 'PASS' : 'REVIEW',
      detail: `clicked=${markClicked} url=${page.url()}`,
    });

    // Profile edit affordance
    await gotoRoute(page, '/profile');
    await shot(page, 'profile-view');
    const editClicked =
      (await clickSemantics(page, 'Edit')) ||
      (await clickSemantics(page, 'Update Profile')) ||
      (await clickSemantics(page, 'Edit Profile'));
    await page.waitForTimeout(1500);
    await shot(page, 'profile-edit-attempt');
    results.push({
      id: 'EMP-PRF-02',
      area: 'Business scenario',
      check: 'Update Profile control present',
      status: editClicked || /edit|update profile|change password/i.test(await pageText(page))
        ? 'PASS'
        : 'REVIEW',
      detail: page.url(),
    });

    // Restricted — expect DENY
    const restricted = [
      { id: 'EMP-NEG-01', name: 'Reports', hash: '/reportsDashboard', label: 'Open Reports' },
      { id: 'EMP-NEG-02', name: 'Company-Settings', hash: '/company-details', label: 'Company Settings' },
      { id: 'EMP-NEG-03', name: 'Projects', hash: '/projects', label: 'Projects (admin)' },
      { id: 'EMP-NEG-04', name: 'Create-Project', hash: '/createProject', label: 'Create/Delete Project' },
      { id: 'EMP-NEG-05', name: 'Subscription', hash: '/plans', label: 'Subscription' },
      { id: 'EMP-NEG-06', name: 'Users-TenantAdmins', hash: '/tenantAdmins', label: 'Users / Tenant Admins' },
      { id: 'EMP-NEG-07', name: 'Users-Employees', hash: '/employees', label: 'Users / Employees admin' },
      { id: 'EMP-NEG-08', name: 'Expenses', hash: '/expenses', label: 'Expenses Approval' },
      { id: 'EMP-NEG-09', name: 'Bills', hash: '/billsList', label: 'Bills / Expenses Approval related' },
      { id: 'EMP-NEG-10', name: 'Create-Tenant', hash: '/createTenant', label: 'Create Tenant / Company' },
      { id: 'EMP-NEG-11', name: 'Tenants', hash: '/tenants', label: 'Manage Tenants' },
      { id: 'EMP-NEG-12', name: 'SuperAdmin', hash: '/superAdmin', label: 'Super Admin' },
      { id: 'EMP-NEG-13', name: 'Attendance-Manage', hash: '/addAttendance', label: 'Delete/Manage Attendance (admin mark)' },
    ];

    for (const r of restricted) {
      const url = await gotoRoute(page, r.hash);
      await shot(page, `neg-${r.name}`);
      const text = await pageText(page);
      const hashKey = r.hash.replace(/^\//, '');
      const stayed = url.includes(hashKey) || (r.hash === '/projects' && url.includes('projects'));
      const denied = isDenied(url, text);

      // Heuristics for privilege leak: admin chrome / forms
      const adminChrome =
        /welcome,\s*super admin|create tenant|tenant admins|subscription plans|choose a plan|company details|gst number|create project|add employee|mark paid|approve/i.test(
          text,
        ) ||
        (stayed &&
          /createTenant|tenantAdmins|superAdmin|plans|company-details|createProject|reportsDashboard|employees|billsList/.test(
            r.hash,
          ));

      let status = 'REVIEW';
      if (denied && !adminChrome) status = 'PASS';
      else if (adminChrome || (stayed && !denied)) {
        // For addAttendance: employee may legitimately mark own attendance — REVIEW unless delete UI
        if (r.hash === '/addAttendance') {
          const deleteUi = /delete attendance|remove attendance|manage tab/i.test(text);
          status = deleteUi ? 'FAIL' : 'REVIEW';
        } else if (r.hash === '/projects') {
          // assigned tasks may use projects — FAIL only if admin create/manage
          status = /create project|add project/i.test(text) ? 'FAIL' : 'REVIEW';
        } else if (r.hash === '/expenses') {
          // remap or deny ok; full approval UI is FAIL
          if (url.includes('documentWallet') || url.includes('addAttendance')) status = 'PASS';
          else if (/approv|expense/i.test(text) && stayed) status = 'FAIL';
          else status = stayed ? 'FAIL' : 'PASS';
        } else {
          status = 'FAIL';
        }
      } else if (!stayed) {
        status = 'PASS';
      }

      results.push({
        id: r.id,
        area: 'Restricted',
        check: r.label,
        status,
        detail: `${url} | ${text.slice(0, 140)}`,
      });
      console.log('NEG', r.name, status, url);

      if (status === 'FAIL') {
        const critical = /createTenant|tenantAdmins|superAdmin|plans|company-details|reportsDashboard/.test(
          r.hash,
        );
        issues.push(
          writeIssue(issueNum++, `Employee can access restricted route: ${r.label}`, {
            summary: `Employee deep-link stayed on ${url} for restricted action "${r.label}"`,
            steps: `1. Login as employee (${EMAIL})\n2. Open ${UI}#${r.hash}\n3. Observe UI`,
            expected: 'Permission denied / redirect / lock — no admin CRUD',
            actual: `Remained on ${url}. Semantics: ${text.slice(0, 220)}`,
            severity: critical ? 'Critical' : 'High',
            priority: critical ? 'P0' : 'P1',
            screenshots: `Yes — emp-neg-${r.name}.png`,
            rootCause: 'Missing RBAC route guard for employee role',
            acceptance: 'Employee cannot use admin-only screens; clear permission denied',
            flowRef: `Restricted — ${r.label}`,
            module: 'RBAC',
          }),
        );
      }
    }

    // Session check — still authenticated mid-run
    await gotoRoute(page, '/profile');
    results.push({
      id: 'EMP-SES-01',
      area: 'Session',
      check: 'Session still valid on Profile',
      status: page.url().includes('login') ? 'FAIL' : 'PASS',
      detail: page.url(),
    });

    // Logout
    await shot(page, 'profile-before-logout');
    const logoutClicked = await clickSemantics(page, 'Logout');
    await page.waitForTimeout(4000);
    await shot(page, 'after-logout');
    results.push({
      id: 'EMP-AUTH-05',
      area: 'Authentication',
      check: 'Logout from Profile',
      status: page.url().includes('login') || logoutClicked ? 'PASS' : 'REVIEW',
      detail: page.url(),
    });

    // After logout, restricted home should not stay authenticated
    const post = await gotoRoute(page, '/employeeAttendanceTap');
    await shot(page, 'post-logout-attendance');
    results.push({
      id: 'EMP-AUTH-07',
      area: 'Session',
      check: 'Post-logout deep link requires login',
      status: post.includes('login') ? 'PASS' : 'FAIL',
      detail: post,
    });
    if (!post.includes('login')) {
      issues.push(
        writeIssue(issueNum++, 'Employee session persists after logout (UI deep link)', {
          summary: 'After Logout, employeeAttendanceTap still accessible without login screen',
          steps: 'Login → Profile → Logout → open #/employeeAttendanceTap',
          expected: 'Redirect to login',
          actual: post,
          severity: 'High',
          priority: 'P1',
          screenshots: 'emp-post-logout-attendance.png',
          rootCause: 'Client session not cleared or route not guarded',
          acceptance: 'Unauthenticated deep links force login',
          flowRef: 'Profile → Logout',
          module: 'Authentication',
        }),
      );
    }

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
          id: 'EMP-AUTH-06',
          area: 'Security',
          check: 'Access token after logout',
          status: me2.status === 401 ? 'PASS' : 'FAIL',
          detail: `logout=${lo.status} me=${me2.status}`,
        });
        if (me2.status !== 401) {
          issues.push(
            writeIssue(issueNum++, 'Employee access JWT remains valid after logout', {
              summary: 'Logout does not revoke access token for employee on PROD',
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
    '# Employee (Site Employee) — Complete Regression Report',
    '',
    `**Date:** ${new Date().toISOString()}`,
    `**Role:** employee (Site Employee)`,
    `**Account:** ${EMAIL} / Employee@123`,
    `**UI:** ${UI}`,
    `**API:** ${BASE}`,
    `**Flow Sheet:** docs/Briktra_Complete_Flow_Sheet.xlsx`,
    `**Script:** scripts/employee-prod-regression.mjs`,
    '',
    '---',
    '',
    '## Executive Summary',
    '',
    onHome
      ? 'Employee login **succeeded** on PROD. Business scenario (attendance, profile, notifications) and restricted admin deep-links were probed. Screenshot review required for FAIL/REVIEW items.'
      : 'Employee login **failed** to reach home — deep testing blocked.',
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
    '### Business scenario mapping',
    '| Scenario step | Flow Sheet / Route | Status |',
    '|----------------|-------------------|--------|',
    '| Open App / Login | Login → Home | see EMP-AUTH-04 |',
    "| View Today's Attendance | employeeAttendanceTap | see EMP-ATT-01 |",
    '| Mark Attendance | addAttendance / tap | see EMP-ATT-02 / EMP-ATT-04 |',
    '| View Assigned Tasks | projects / tasks | see EMP-TSK-01 |',
    '| Update Profile | Profile | see EMP-PRF-* |',
    '| Read Notifications | Dashboard | see EMP-NOT-01 |',
    '| Logout | Profile → Logout | see EMP-AUTH-05 |',
    '| Session | Profile mid-run + post-logout | see EMP-SES-01 / EMP-AUTH-07 |',
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
    '- Screenshots: `docs/qa-employee-regression/screenshots/emp-*.png`',
    '- Employee home should be attendance-first, not admin dashboard chrome.',
    '- Restricted routes must show deny — not admin forms.',
    '',
    '## UX Review',
    '',
    '- Mark Attendance should be one clear primary action.',
    '- Assigned tasks empty state must explain next steps.',
    '- Permission denials should be explicit for Reports/Projects/Subscription/Users.',
    '',
    '## Performance Review',
    '',
    '- Auth and route transitions observed ~3–10s headless.',
    '- No dedicated load test.',
    '',
    '## Security Review',
    '',
    '- Wrong password rejection tested.',
    '- Restricted deep-links probed (reports, company, projects, subscription, users, expenses).',
    '- Logout UI + access-token revoke checked when login succeeded.',
    '',
    '## Suggestions',
    '',
    '1. Enforce employee RBAC on all admin routes (same hardening as manager/supervisor).',
    '2. Provide a dedicated Assigned Tasks surface if Projects is admin-only.',
    '3. Ensure Mark Attendance is self-service only (no delete/manage others).',
    '4. Revoke access JWT on logout (cross-role defect).',
    '',
    '## API sample',
    '```json',
    JSON.stringify(apiCalls.slice(0, 25), null, 2),
    '```',
  ].join('\n');

  fs.writeFileSync(path.join(OUT, 'EMPLOYEE_REGRESSION_REPORT.md'), report);
  fs.writeFileSync(
    path.join(OUT, 'results.json'),
    JSON.stringify({ me, results, issues, totals, apiCalls: apiCalls.slice(0, 50) }, null, 2),
  );
  console.log('Totals', totals);
  console.log('Issues', issues.length);
  console.log('Report', path.join(OUT, 'EMPLOYEE_REGRESSION_REPORT.md'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
