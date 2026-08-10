/**
 * Confirm logout dialog + token revoke for employee.
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

function hashPassword(identifier, password) {
  const salt = crypto.createHash('sha256').update(identifier + SALT, 'utf8').digest();
  return crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), salt, 10000, 32, 'sha256').toString('base64');
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
  return { status: res.status, ok: res.ok, body: await res.text() };
}

async function clickSem(page, pattern) {
  const el = page.locator('flt-semantics', { hasText: pattern });
  if (!(await el.count())) return false;
  const box = await el.first().boundingBox();
  if (!box) return false;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(1200);
  return true;
}

async function passLanguage(page) {
  for (let i = 0; i < 3; i++) {
    if (!page.url().includes('languageSelection')) return;
    await page.evaluate(() => document.querySelector('flt-semantics-placeholder')?.click());
    await page.waitForTimeout(500);
    await clickSem(page, /^English$/i);
    if (!(await clickSem(page, /Change Language/i))) await page.mouse.click(960, 720);
    await page.waitForTimeout(1500);
  }
}

async function main() {
  const hint = await api('GET', '/auth/login/hint', { query: { username: EMAIL } });
  const id = JSON.parse(hint.body).hash_identifier || EMAIL;
  const login = await api('POST', '/auth/login', {
    body: { username: EMAIL, password: hashPassword(id, PASSWORD) },
  });
  const tok = JSON.parse(login.body);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(UI, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(`${UI}#/login`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4000);
  await passLanguage(page);
  if (!page.url().includes('/login')) {
    await page.goto(`${UI}#/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await passLanguage(page);
  }
  await page.evaluate(() => document.querySelector('flt-semantics-placeholder')?.click());
  await page.waitForTimeout(1200);
  await page.waitForSelector('input', { timeout: 20000 });
  await page.locator('input').first().click({ force: true });
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(EMAIL, { delay: 30 });
  await page.locator('input[type="password"]').first().click({ force: true });
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(PASSWORD, { delay: 30 });
  await clickSem(page, /^Login$/);
  await page.waitForTimeout(6000);
  console.log('home', page.url());

  await page.goto(`${UI}#/profile`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await clickSem(page, /^Logout$/);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SHOTS, 'emp-logout-dialog.png'), fullPage: true });
  // confirm dialog Logout (second Logout button)
  const logoutBtns = page.locator('flt-semantics[role="button"]', { hasText: /^Logout$/ });
  console.log('logout buttons', await logoutBtns.count());
  if ((await logoutBtns.count()) >= 1) {
    const box = await logoutBtns.last().boundingBox();
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  }
  await page.waitForTimeout(5000);
  console.log('after confirm', page.url());
  await page.screenshot({ path: path.join(SHOTS, 'emp-after-logout-confirmed.png'), fullPage: true });

  await page.goto(`${UI}#/employeeAttendanceTap`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  console.log('deep after logout', page.url());
  await page.screenshot({ path: path.join(SHOTS, 'emp-post-logout-confirmed.png'), fullPage: true });

  const lo = await api('POST', '/auth/logout', {
    body: { refresh_token: tok.refresh_token },
    token: tok.access_token,
  });
  const me2 = await api('GET', '/auth/me', { token: tok.access_token });
  console.log('api logout', lo.status, 'me after', me2.status);

  fs.writeFileSync(
    path.join(OUT, 'logout-recheck.json'),
    JSON.stringify(
      {
        afterConfirmUrl: page.url(),
        apiLogout: lo.status,
        meAfter: me2.status,
      },
      null,
      2,
    ),
  );
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
