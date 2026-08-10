/**
 * Capture login network payload from browser for Abcd@123
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'docs', 'qa-tenant-regression');
const EMAIL = 'tenant@yopmail.com';
const PASSWORD = 'Abcd@123';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const captures = [];

  page.on('request', (req) => {
    if (req.url().includes('/auth/login') && req.method() === 'POST') {
      captures.push({ url: req.url(), body: req.postData() });
    }
  });
  page.on('response', async (res) => {
    if (res.url().includes('/auth/login')) {
      let body = '';
      try {
        body = await res.text();
      } catch {}
      captures.push({ url: res.url(), status: res.status(), body: body.slice(0, 500) });
    }
  });

  await page.goto('https://briktra.com/app/index.html#/login', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4000);

  if (page.url().includes('languageSelection')) {
    await page.getByText('Change Language').click({ timeout: 10000 });
    await page.waitForTimeout(3000);
  }

  // Flutter semantics: click by aria/semantics labels
  const emailField = page.getByPlaceholder(/email|phone/i);
  if (await emailField.count()) {
    await emailField.first().fill(EMAIL);
  } else {
    await page.getByText('Email/Phone Number').click({ timeout: 5000 }).catch(() => {});
    await page.keyboard.type(EMAIL, { delay: 50 });
  }

  const pwdField = page.getByPlaceholder(/password/i);
  if (await pwdField.count()) {
    await pwdField.first().fill(PASSWORD);
  } else {
    await page.getByText(/^Password$/).click({ timeout: 5000 }).catch(() => {});
    await page.keyboard.type(PASSWORD, { delay: 50 });
  }

  await page.getByRole('button', { name: /^Login$/i }).click({ timeout: 10000 }).catch(async () => {
    await page.getByText(/^Login$/).click();
  });

  await page.waitForTimeout(10000);
  const result = {
    finalUrl: page.url(),
    onDashboard: page.url().includes('dashboard'),
    captures,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(OUT, 'browser-login-capture.json'), JSON.stringify(result, null, 2));
  await page.screenshot({ path: path.join(OUT, 'screenshots', 'browser-login-capture.png'), fullPage: true });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
