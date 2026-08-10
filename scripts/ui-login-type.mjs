/**
 * UI login via keyboard typing into Flutter fields + orange button click.
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
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const net = [];
  page.on('request', (req) => {
    if (req.url().includes('execute-api') || req.url().includes('/auth/')) {
      net.push({
        t: 'req',
        m: req.method(),
        u: req.url().replace(/^https:\/\/[^/]+/, ''),
        b: req.postData()?.slice(0, 200),
      });
    }
  });
  page.on('response', async (res) => {
    if (res.url().includes('/auth/')) {
      let body = '';
      try {
        body = (await res.text()).slice(0, 300);
      } catch {}
      net.push({ t: 'res', s: res.status(), u: res.url().replace(/^https:\/\/[^/]+/, ''), body });
    }
  });

  await page.goto('https://briktra.com/app/index.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto('https://briktra.com/app/index.html#/login', {
    waitUntil: 'networkidle',
    timeout: 90000,
  });
  await page.waitForTimeout(5000);

  // If language gate
  if (page.url().includes('languageSelection') || (await page.locator('text=Select Your Language').count())) {
    await page.mouse.click(920, 300);
    await page.waitForTimeout(300);
    await page.mouse.click(920, 700);
    await page.waitForTimeout(3000);
    await page.goto('https://briktra.com/app/index.html#/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
  }

  await page.evaluate(() => document.querySelector('flt-semantics-placeholder')?.click());
  await page.waitForTimeout(1000);

  // Focus email via semantics / input, then type
  const emailInput = page.locator('input').first();
  await emailInput.click({ force: true });
  await page.waitForTimeout(200);
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(EMAIL, { delay: 50 });
  await page.waitForTimeout(400);

  const pwdInput = page.locator('input[type="password"]').first();
  await pwdInput.click({ force: true });
  await page.waitForTimeout(200);
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(PASSWORD, { delay: 50 });
  await page.waitForTimeout(400);

  await page.screenshot({ path: path.join(SHOTS, 'ui-type-filled.png'), fullPage: true });

  // Dump semantics tree for login button
  const labels = await page.evaluate(() => {
    return [...document.querySelectorAll('flt-semantics, [role="button"], button')]
      .map((el) => ({
        tag: el.tagName,
        role: el.getAttribute('role'),
        label: el.getAttribute('aria-label'),
        text: (el.innerText || '').slice(0, 40),
      }))
      .filter((x) => x.label || x.text)
      .slice(0, 40);
  });
  console.log('semantics', JSON.stringify(labels, null, 2));

  // Try Enter key first (often submits Flutter form)
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);

  if (net.filter((n) => n.u?.includes('/auth/login')).length === 0) {
    // Click orange login button area (right panel)
    await page.mouse.click(960, 555);
    await page.waitForTimeout(3000);
  }
  if (net.filter((n) => n.u?.includes('/auth/login')).length === 0) {
    // Try Tamil / English login via aria
    for (const name of ['Login', 'உள்நுழைவு', 'Sign in']) {
      const el = page.locator(`[aria-label="${name}"], flt-semantics[aria-label="${name}"]`);
      if (await el.count()) {
        await el.last().click({ force: true });
        console.log('clicked aria', name);
        break;
      }
    }
    await page.waitForTimeout(5000);
  }

  await page.screenshot({ path: path.join(SHOTS, 'ui-type-result.png'), fullPage: true });

  const result = {
    finalUrl: page.url(),
    onDashboard: page.url().includes('dashboard'),
    net: net.map((n) => {
      if (n.b && n.b.includes('password')) {
        try {
          const o = JSON.parse(n.b);
          if (o.password) o.password = `len:${String(o.password).length}`;
          return { ...n, b: JSON.stringify(o) };
        } catch {}
      }
      if (n.body && n.body.includes('access_token')) {
        return {
          ...n,
          body: n.body.replace(/"(access_token|refresh_token|id_token)":"[^"]+"/g, '"$1":"***"'),
        };
      }
      return n;
    }),
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(OUT, 'ui-login-abcd.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
