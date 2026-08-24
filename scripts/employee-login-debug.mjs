/**
 * Fix language gate then login as employee; capture auth payload.
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const UI = process.env.BRIKTRA_UI_BASE || '';
const BASE = process.env.BRIKTRA_API_BASE || '';
const SALT = process.env.BRIKTRA_SALT_GUID || '';
const EMAIL = 'employee.briktra@yopmail.com';
const PASSWORD = 'Employee@123';
const OUT = path.join(ROOT, 'docs', 'qa-employee-regression');
const SHOTS = path.join(OUT, 'screenshots');

function hashPassword(identifier, password) {
  const salt = crypto.createHash('sha256').update(identifier + SALT, 'utf8').digest();
  return crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), salt, 10000, 32, 'sha256').toString('base64');
}

async function dumpSem(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('flt-semantics')].map((n, i) => ({
      i,
      role: n.getAttribute('role'),
      label: n.getAttribute('aria-label'),
      text: (n.innerText || '').slice(0, 80),
    })),
  );
}

async function clickLabel(page, pattern) {
  const el = page.locator('flt-semantics', { hasText: pattern });
  const n = await el.count();
  if (!n) return false;
  const box = await el.first().boundingBox();
  if (!box) return false;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(1500);
  return true;
}

async function passLanguage(page) {
  for (let attempt = 0; attempt < 4; attempt++) {
    if (!page.url().includes('languageSelection')) return true;
    await page.evaluate(() => document.querySelector('flt-semantics-placeholder')?.click());
    await page.waitForTimeout(800);
    await clickLabel(page, /^English$/i);
    const clicked =
      (await clickLabel(page, /^Change Language$/i)) ||
      (await clickLabel(page, /Change Language/i)) ||
      (await clickLabel(page, /^Continue$/i));
    console.log('lang attempt', attempt, 'clicked', clicked, page.url());
    await page.waitForTimeout(2000);
    if (!page.url().includes('languageSelection')) return true;
    // fallback coordinates for Change Language button (bottom of right panel)
    await page.mouse.click(960, 720);
    await page.waitForTimeout(2500);
  }
  return !page.url().includes('languageSelection');
}

async function main() {
  fs.mkdirSync(SHOTS, { recursive: true });
  const hintRes = await fetch(`${BASE}/auth/login/hint?username=${encodeURIComponent(EMAIL)}`, {
    headers: { Accept: 'application/json', 'X-Client-Platform': 'flutter' },
  });
  const hint = await hintRes.json();
  const expectedHash = hashPassword(hint.hash_identifier || EMAIL, PASSWORD);
  console.log('expected hash', expectedHash);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const net = [];
  page.on('request', (req) => {
    if (req.url().includes('/auth/login') && req.method() === 'POST') {
      net.push({ t: 'req', b: req.postData() });
    }
  });
  page.on('response', async (res) => {
    if (res.url().includes('/auth/login') && res.request().method() === 'POST') {
      net.push({ t: 'res', s: res.status(), body: (await res.text().catch(() => '')).slice(0, 400) });
    }
  });

  await page.goto(UI, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(`${UI}#/login`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(5000);
  console.log('start', page.url());
  await page.screenshot({ path: path.join(SHOTS, 'emp-lang-start.png'), fullPage: true });

  await passLanguage(page);
  console.log('after lang', page.url());
  await page.screenshot({ path: path.join(SHOTS, 'emp-lang-done.png'), fullPage: true });

  if (!page.url().includes('/login')) {
    await page.goto(`${UI}#/login`, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(4000);
    await passLanguage(page);
  }

  await page.evaluate(() => document.querySelector('flt-semantics-placeholder')?.click());
  await page.waitForTimeout(1500);
  try {
    await page.waitForSelector('input', { timeout: 25000, state: 'attached' });
  } catch {
    console.log('no inputs; sem=', JSON.stringify(await dumpSem(page), null, 2));
    await page.screenshot({ path: path.join(SHOTS, 'emp-no-inputs.png'), fullPage: true });
  }

  const inputs = page.locator('input');
  console.log('inputs', await inputs.count());
  if (await inputs.count()) {
    await inputs.first().click({ force: true });
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(EMAIL, { delay: 40 });
    const pwd = page.locator('input[type="password"]');
    await pwd.first().click({ force: true });
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(PASSWORD, { delay: 40 });
    console.log('email', await inputs.first().inputValue());
    console.log('pwdLen', (await pwd.first().inputValue()).length);
    await page.screenshot({ path: path.join(SHOTS, 'emp-filled-langfix.png'), fullPage: true });

    const loginBtn = page.locator('flt-semantics[role="button"]', { hasText: /^Login$/ });
    console.log('login buttons', await loginBtn.count());
    const box = await loginBtn.first().boundingBox();
    console.log('box', box);
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(10000);
  }

  console.log('final', page.url());
  await page.screenshot({ path: path.join(SHOTS, 'emp-after-login-attempt.png'), fullPage: true });
  for (const n of net) {
    if (n.b) {
      try {
        const o = JSON.parse(n.b);
        console.log('POST user', o.username, 'hashMatch', o.password === expectedHash, 'len', o.password?.length);
      } catch {
        console.log('POST raw', n.b.slice(0, 120));
      }
    } else console.log(n);
  }
  fs.writeFileSync(path.join(OUT, 'login-debug.json'), JSON.stringify({ hint, expectedHash, net, url: page.url() }, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
