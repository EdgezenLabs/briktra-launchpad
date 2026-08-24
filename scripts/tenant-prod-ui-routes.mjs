import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'docs', 'qa-tenant-regression');
const SHOTS = path.join(OUT, 'screenshots');
const UI = process.env.BRIKTRA_UI_BASE || '';
const EMAIL = process.env.BRIKTRA_TEST_EMAIL || '';
const PASSWORD = process.env.BRIKTRA_PASSWORD || '';

const ROUTES = [
  ['Dashboard', '/dashboard'],
  ['Projects', '/projects'],
  ['Create-Project', '/createProject'],
  ['Employees', '/employees'],
  ['Suppliers', '/suppliers'],
  ['Contractors', '/contractors'],
  ['Bills', '/billsList'],
  ['Wallet', '/documentWallet'],
  ['Reports', '/reportsDashboard'],
  ['Stock', '/stockManagement'],
  ['Payroll', '/payrollList'],
  ['Attendance', '/addAttendance'],
  ['Profile', '/profile'],
  ['Plans', '/plans'],
  ['Company-Details', '/company-details'],
];

async function login(page) {
  await page.goto(UI, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${UI}#/login`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4000);
  if (page.url().includes('languageSelection')) {
    await page.mouse.click(920, 300);
    await page.waitForTimeout(300);
    await page.mouse.click(920, 700);
    await page.waitForTimeout(2500);
    await page.goto(`${UI}#/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
  }
  await page.evaluate(() => document.querySelector('flt-semantics-placeholder')?.click());
  await page.waitForTimeout(1000);
  await page.locator('input').first().click({ force: true });
  await page.keyboard.press('Control+A');
  await page.keyboard.type(EMAIL, { delay: 40 });
  await page.locator('input[type="password"]').click({ force: true });
  await page.keyboard.press('Control+A');
  await page.keyboard.type(PASSWORD, { delay: 40 });
  const btn = page.locator('flt-semantics[role="button"]', { hasText: /^Login$/ });
  const box = await btn.first().boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForURL(/dashboard/, { timeout: 30000 });
  await page.waitForTimeout(4000);
}

async function main() {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const apiCalls = [];
  page.on('response', async (res) => {
    if (res.url().includes('execute-api')) {
      apiCalls.push({
        status: res.status(),
        url: res.url().replace(/^https:\/\/[^/]+/, ''),
        method: res.request().method(),
      });
    }
  });

  console.log('Logging inâ€¦');
  await login(page);
  console.log('Logged in', page.url());

  const results = [];
  for (const [name, hash] of ROUTES) {
    await page.goto(`${UI}#${hash}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3500);
    const url = page.url();
    const shot = path.join(SHOTS, `prod-${name}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    const redirected = url.includes('#/login');
    results.push({
      name,
      hash,
      url,
      status: redirected ? 'FAIL' : 'PASS',
      shot,
    });
    console.log(name, redirected ? 'FAIL' : 'PASS', url);
  }

  fs.writeFileSync(
    path.join(OUT, 'prod-ui-routes.json'),
    JSON.stringify({ results, apiSample: apiCalls.slice(0, 40) }, null, 2),
  );
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
