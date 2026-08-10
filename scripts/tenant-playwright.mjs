/**
 * Tenant UI smoke — Playwright against live Briktra web app.
 * Requires: npx playwright install chromium (first run)
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'docs', 'qa-tenant-regression', 'screenshots');
const UI = 'https://briktra.com/app/index.html#/login';
const EMAIL = 'tenant@yopmail.com';
const PASSWORDS = ['Abcd@123', 'Tenant@123'];

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
  { name: 'Company Details', hash: '/company-details' },
  { name: 'Change Password', hash: '/changePassword' },
];

async function handleLanguageSelection(page) {
  if (!page.url().includes('languageSelection')) return;
  const btn = page.getByText('Change Language', { exact: false });
  if (await btn.count()) {
    await btn.first().click();
    await page.waitForTimeout(2000);
    return;
  }
  // Coordinate fallback — orange CTA bottom-right panel
  await page.mouse.click(960, 720);
  await page.waitForTimeout(2000);
}

async function tryFlutterLogin(page, password) {
  await page.goto(UI, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  await handleLanguageSelection(page);

  // Flutter semantics inputs
  const semInputs = page.locator(
    'flt-semantics input, flt-semantics textarea, input[type="text"], input[type="email"], input[type="password"]',
  );
  const count = await semInputs.count();
  if (count >= 2) {
    await semInputs.nth(0).fill(EMAIL);
    await semInputs.nth(1).fill(password);
    const loginBtn = page.getByText(/log in|login/i);
    if (await loginBtn.count()) await loginBtn.first().click();
    else await page.keyboard.press('Enter');
    return { method: 'semantics-input', inputCount: count };
  }

  // Click email field area then type (canvas fallback)
  await page.mouse.click(960, 380);
  await page.keyboard.type(EMAIL, { delay: 30 });
  await page.mouse.click(960, 460);
  await page.keyboard.type(password, { delay: 30 });
  await page.mouse.click(960, 560);
  return { method: 'coordinate-fallback', inputCount: count };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
  });
  const page = await context.newPage();
  const uiResults = [];

  for (const pw of PASSWORDS) {
    console.log('Trying password:', pw.replace(/./g, '*'));
    const loginMeta = await tryFlutterLogin(page, pw);
    await page.waitForTimeout(5000);
    const url = page.url();
    const shot = path.join(OUT, `login-${pw.replace(/[@]/g, '')}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    const onDashboard = url.includes('dashboard') || url.includes('#/dashboard');
    uiResults.push({
      password: pw,
      url,
      onDashboard,
      loginMeta,
      screenshot: shot,
      status: onDashboard ? 'PASS' : 'FAIL',
    });
    console.log('  url:', url, onDashboard ? 'PASS' : 'FAIL');
    if (onDashboard) break;
    await page.goto(UI, { waitUntil: 'networkidle', timeout: 60000 });
  }

  const loggedIn = uiResults.find((r) => r.status === 'PASS');
  if (loggedIn) {
    for (const route of ROUTES) {
      const target = `https://briktra.com/app/index.html#${route.hash}`;
      await page.goto(target, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(2500);
      const shot = path.join(OUT, `route-${route.name.replace(/\s+/g, '-')}.png`);
      await page.screenshot({ path: shot, fullPage: true });
      const bodyText = await page.locator('body').innerText();
      const hasError =
        /error|invalid|failed|signature|unauthorized|something went wrong/i.test(bodyText);
      const empty = bodyText.trim().length < 50;
      uiResults.push({
        route: route.name,
        hash: route.hash,
        status: hasError ? 'FAIL' : empty ? 'REVIEW' : 'PASS',
        screenshot: shot,
        textLen: bodyText.length,
      });
      console.log(`  ${route.name}: ${hasError ? 'FAIL' : 'PASS/REVIEW'} (${bodyText.length} chars)`);
    }
  }

  fs.writeFileSync(
    path.join(__dirname, '..', 'docs', 'qa-tenant-regression', 'ui-results.json'),
    JSON.stringify(uiResults, null, 2),
  );
  await browser.close();
  console.log('UI results saved');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
