/**
 * Browser login test matching user video flow:
 * Language Selection â†’ Login â†’ Dashboard
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'docs', 'qa-tenant-regression', 'screenshots');
const EMAIL = process.env.BRIKTRA_TEST_EMAIL || '';
const PASSWORD = process.env.BRIKTRA_PASSWORD || '';

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const network = [];
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/auth/')) {
      let body = '';
      try {
        body = (await res.text()).slice(0, 200);
      } catch {}
      network.push({ url, status: res.status(), body });
    }
  });

  await page.goto('https://briktra.com/app/index.html', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT, 'video-recheck-01-start.png'), fullPage: true });

  // Language selection
  if (page.url().includes('languageSelection')) {
    const changeLang = page.getByText('Change Language');
    if (await changeLang.count()) await changeLang.click();
    else await page.mouse.click(960, 720);
    await page.waitForTimeout(2500);
  }
  await page.screenshot({ path: path.join(OUT, 'video-recheck-02-login.png'), fullPage: true });

  // Enable accessibility / find inputs
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('flt-semantics-placeholder, flt-semantics')];
    for (const b of btns) b.click?.();
  });

  const inputs = page.locator(
    'input[type="text"], input[type="email"], input:not([type]), input[type="password"], flt-semantics input',
  );
  const n = await inputs.count();
  console.log('inputs found:', n);

  if (n >= 2) {
    await inputs.nth(0).click({ force: true });
    await inputs.nth(0).fill(EMAIL);
    await inputs.nth(1).click({ force: true });
    await inputs.nth(1).fill(PASSWORD);
  } else {
    // Coordinate clicks on login form (right panel)
    await page.mouse.click(960, 400);
    await page.keyboard.type(EMAIL, { delay: 40 });
    await page.mouse.click(960, 480);
    await page.keyboard.type(PASSWORD, { delay: 40 });
  }

  await page.screenshot({ path: path.join(OUT, 'video-recheck-03-filled.png'), fullPage: true });

  const loginBtn = page.getByText(/^Login$/i);
  if (await loginBtn.count()) await loginBtn.first().click();
  else await page.mouse.click(960, 560);

  await page.waitForTimeout(8000);
  const url = page.url();
  await page.screenshot({ path: path.join(OUT, 'video-recheck-04-after-login.png'), fullPage: true });

  const result = {
    email: EMAIL,
    password: PASSWORD,
    finalUrl: url,
    onDashboard: url.includes('dashboard'),
    onLogin: url.includes('login'),
    network,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(__dirname, '..', 'docs', 'qa-tenant-regression', 'video-recheck-login.json'),
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
