/**
 * API login + token inject + route screenshots for Tenant UI review.
 */
import crypto from 'crypto';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa';
const SALT = 'briktra-password-salt-guid-2026';
const OUT = path.join(__dirname, '..', 'docs', 'qa-tenant-regression', 'screenshots');
const EMAIL = 'tenant@yopmail.com';
const PASSWORD = process.env.BRIKTRA_PASSWORD || 'Tenant@123';

function hash(id, pw) {
  const salt = crypto.createHash('sha256').update(id + SALT, 'utf8').digest();
  return crypto.pbkdf2Sync(Buffer.from(pw, 'utf8'), salt, 10000, 32, 'sha256').toString('base64');
}

async function apiLogin() {
  const hint = await (
    await fetch(`${BASE}/auth/login/hint?username=${encodeURIComponent(EMAIL)}`, {
      headers: { 'X-Client-Platform': 'flutter' },
    })
  ).json();
  const login = await (
    await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Client-Platform': 'flutter' },
      body: JSON.stringify({
        username: EMAIL,
        password: hash(hint.hash_identifier, PASSWORD),
      }),
    })
  ).json();
  return login;
}

const ROUTES = [
  { name: 'Dashboard', hash: '/dashboard' },
  { name: 'Projects', hash: '/projects' },
  { name: 'Employees', hash: '/employees' },
  { name: 'Suppliers', hash: '/suppliers' },
  { name: 'Contractors', hash: '/contractors' },
  { name: 'Bills', hash: '/billsList' },
  { name: 'Wallet', hash: '/documentWallet' },
  { name: 'Reports', hash: '/reportsDashboard' },
  { name: 'Stock', hash: '/stockManagement' },
  { name: 'Payroll', hash: '/payrollList' },
  { name: 'Attendance', hash: '/addAttendance' },
  { name: 'Profile', hash: '/profile' },
  { name: 'Plans', hash: '/plans' },
  { name: 'Company-Details', hash: '/company-details' },
  { name: 'Create-Project', hash: '/createProject' },
];

async function injectTokens(page, login) {
  const expiry = Date.now() + (login.access_token_expires_in || 86400) * 1000;
  const userJson = JSON.stringify(login);
  await page.goto('https://briktra.com/app/index.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(
    ({ login, expiry, userJson }) => {
      const data = {
        access_token: login.access_token,
        refresh_token: login.refresh_token,
        id_token: login.id_token,
        token_expiry: String(expiry),
        user: userJson,
      };
      for (const [k, v] of Object.entries(data)) {
        localStorage.setItem(k, v);
        localStorage.setItem(`flutter.${k}`, v);
      }
    },
    { login, expiry, userJson },
  );
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const login = await apiLogin();
  if (!login.access_token) throw new Error('API login failed');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const results = [];

  await injectTokens(page, login);
  await page.goto('https://briktra.com/app/index.html#/dashboard', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  await page.waitForTimeout(4000);
  const dashUrl = page.url();
  const onDash = dashUrl.includes('dashboard');
  results.push({ route: 'Dashboard-auth-inject', url: dashUrl, status: onDash ? 'PASS' : 'FAIL' });
  await page.screenshot({ path: path.join(OUT, 'auth-inject-dashboard.png'), fullPage: true });

  for (const r of ROUTES) {
    await page.goto(`https://briktra.com/app/index.html#${r.hash}`, {
      waitUntil: 'networkidle',
      timeout: 45000,
    });
    await page.waitForTimeout(3000);
    const url = page.url();
    const bodyText = await page.locator('body').innerText();
    const redirectedLogin = url.includes('/login') || url.includes('languageSelection');
    const hasError = /invalid credentials|something went wrong|error loading|signature required/i.test(
      bodyText,
    );
    const status = redirectedLogin ? 'FAIL-AUTH' : hasError ? 'FAIL' : 'PASS';
    await page.screenshot({ path: path.join(OUT, `route-${r.name}.png`), fullPage: true });
    results.push({ route: r.name, hash: r.hash, url, status, textLen: bodyText.length });
    console.log(r.name, status, url);
  }

  fs.writeFileSync(
    path.join(__dirname, '..', 'docs', 'qa-tenant-regression', 'ui-route-results.json'),
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
