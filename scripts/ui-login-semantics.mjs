/**
 * Click Flutter semantics Login button after typing credentials.
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'docs', 'qa-tenant-regression');
const SHOTS = path.join(OUT, 'screenshots');
const EMAIL = process.env.BRIKTRA_TEST_EMAIL || '';
const PASSWORD = process.env.BRIKTRA_PASSWORD || '';

async function main() {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const net = [];
  page.on('request', (req) => {
    if (req.url().includes('/auth/')) {
      net.push({ t: 'req', m: req.method(), u: req.url(), b: req.postData()?.slice(0, 300) });
    }
  });
  page.on('response', async (res) => {
    if (res.url().includes('/auth/')) {
      let body = '';
      try {
        body = (await res.text()).slice(0, 400);
      } catch {}
      net.push({ t: 'res', s: res.status(), u: res.url(), body });
    }
  });

  await page.goto('https://briktra.com/app/index.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('https://briktra.com/app/index.html#/login', {
    waitUntil: 'networkidle',
    timeout: 90000,
  });
  await page.waitForTimeout(4000);

  if (page.url().includes('languageSelection')) {
    await page.mouse.click(920, 300);
    await page.waitForTimeout(300);
    await page.mouse.click(920, 700);
    await page.waitForTimeout(2500);
    await page.goto('https://briktra.com/app/index.html#/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
  }

  await page.evaluate(() => document.querySelector('flt-semantics-placeholder')?.click());
  await page.waitForTimeout(1000);

  // Type into inputs
  await page.locator('input').first().click({ force: true });
  await page.keyboard.press('Control+A');
  await page.keyboard.type(EMAIL, { delay: 40 });
  await page.locator('input[type="password"]').click({ force: true });
  await page.keyboard.press('Control+A');
  await page.keyboard.type(PASSWORD, { delay: 40 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, 'ui-sem-filled.png'), fullPage: true });

  // Click the Login BUTTON specifically (role=button)
  const loginBtn = page.locator('flt-semantics[role="button"]', { hasText: /^Login$/ });
  console.log('login buttons', await loginBtn.count());
  const box = await loginBtn.first().boundingBox();
  console.log('login box', box);
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  } else {
    await loginBtn.first().click({ force: true });
  }

  // Wait for auth network
  try {
    await page.waitForResponse(
      (r) => r.url().includes('/auth/login') && r.request().method() === 'POST',
      { timeout: 20000 },
    );
  } catch (e) {
    console.log('no login response yet', e.message);
  }
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(SHOTS, 'ui-sem-result.png'), fullPage: true });

  const redact = (arr) =>
    arr.map((n) => {
      let b = n.b || n.body;
      if (!b) return n;
      if (b.includes('password')) {
        try {
          const o = JSON.parse(b);
          if (o.password) o.password = `len:${String(o.password).length}`;
          b = JSON.stringify(o);
        } catch {}
      }
      b = String(b).replace(/"(access_token|refresh_token|id_token)":"[^"]+"/g, '"$1":"***"');
      return { ...n, b, body: undefined };
    });

  const result = {
    finalUrl: page.url(),
    onDashboard: page.url().includes('dashboard'),
    net: redact(net),
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(OUT, 'ui-login-abcd.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));

  if (result.onDashboard) {
    for (const [name, hash] of [
      ['dashboard', '/dashboard'],
      ['projects', '/projects'],
      ['employees', '/employees'],
      ['profile', '/profile'],
    ]) {
      await page.goto(`https://briktra.com/app/index.html#${hash}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(SHOTS, `ui-pass-${name}.png`), fullPage: true });
      console.log(name, page.url());
    }
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
