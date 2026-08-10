/**
 * UI login with Tamil CTA: tenant@yopmail.com / Abcd@123
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'docs', 'qa-tenant-regression');
const SHOTS = path.join(OUT, 'screenshots');
const EMAIL = 'tenant@yopmail.com';
const PASSWORD = 'Abcd@123';

async function main() {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
  });
  const page = await context.newPage();

  const loginPosts = [];
  page.on('request', (req) => {
    if (req.method() === 'POST' && req.url().includes('/auth/login')) {
      loginPosts.push({ type: 'req', url: req.url(), body: req.postData(), headers: req.headers() });
    }
  });
  page.on('response', async (res) => {
    if (res.url().includes('/auth/') && res.request().method() === 'POST') {
      let text = '';
      try {
        text = await res.text();
      } catch {}
      loginPosts.push({
        type: 'res',
        url: res.url(),
        status: res.status(),
        body: text.slice(0, 600),
      });
    }
  });

  // Clear storage so we get English if possible, then go login
  await page.goto('https://briktra.com/app/index.html', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.evaluate(() => localStorage.clear());
  await page.goto('https://briktra.com/app/index.html#/languageSelection', {
    waitUntil: 'networkidle',
    timeout: 90000,
  });
  await page.waitForTimeout(3000);

  // Select English via coordinates then confirm
  const vp = { width: 1280, height: 800 };
  const cx = Math.floor(vp.width * 0.72);
  await page.mouse.click(cx, 300); // English
  await page.waitForTimeout(400);
  await page.mouse.click(cx, 700); // Change Language
  await page.waitForTimeout(3000);

  await page.goto('https://briktra.com/app/index.html#/login', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  await page.waitForTimeout(3000);

  // Enable semantics
  await page.evaluate(() => {
    document.querySelector('flt-semantics-placeholder')?.click();
  });
  await page.waitForTimeout(800);

  const inputs = page.locator('input');
  await inputs.nth(0).fill(EMAIL, { force: true });
  const pwd = page.locator('input[type="password"]');
  if (await pwd.count()) await pwd.first().fill(PASSWORD, { force: true });
  else await inputs.nth(1).fill(PASSWORD, { force: true });

  await page.screenshot({ path: path.join(SHOTS, 'ui-login-abcd-filled.png'), fullPage: true });

  // Click Login in English OR Tamil
  const loginEn = page.getByText(/^Login$/);
  const loginTa = page.getByText('உள்நுழைவு');
  if (await loginEn.count()) {
    await loginEn.first().click({ force: true });
    console.log('clicked English Login');
  } else if (await loginTa.count()) {
    // Avoid clicking the title — click the button-sized one (last)
    const count = await loginTa.count();
    await loginTa.nth(count - 1).click({ force: true });
    console.log('clicked Tamil Login, count', count);
  } else {
    await page.mouse.click(cx, 560);
    console.log('clicked Login by coordinate');
  }

  // Wait for navigation or error
  await page.waitForTimeout(12000);
  await page.screenshot({ path: path.join(SHOTS, 'ui-login-abcd-result.png'), fullPage: true });

  const result = {
    email: EMAIL,
    password: PASSWORD,
    finalUrl: page.url(),
    onDashboard: page.url().includes('dashboard'),
    loginPosts: loginPosts.map((p) => {
      if (p.body && /access_token/.test(p.body)) {
        return { ...p, body: p.body.replace(/"(access_token|refresh_token|id_token)":"[^"]+"/g, '"$1":"***"') };
      }
      // redact password from request if present
      if (p.body && p.type === 'req') {
        try {
          const o = JSON.parse(p.body);
          if (o.password) o.password = `<len:${o.password.length}>`;
          return { ...p, body: JSON.stringify(o) };
        } catch {}
      }
      return p;
    }),
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
      await page.goto(`https://briktra.com/app/index.html#${hash}`, {
        waitUntil: 'networkidle',
        timeout: 45000,
      });
      await page.waitForTimeout(3500);
      await page.screenshot({ path: path.join(SHOTS, `ui-pass-${name}.png`), fullPage: true });
      console.log('PASS route', name, page.url());
    }
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
