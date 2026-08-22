/**
 * Check if employeeAttendanceTap requires auth.
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UI = process.env.BRIKTRA_UI_BASE || '';
const OUT = path.join(__dirname, '..', 'docs', 'qa-employee-regression');
const SHOTS = path.join(OUT, 'screenshots');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(UI, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(`${UI}#/employeeAttendanceTap`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(5000);
  console.log('url', page.url());
  const text = await page.evaluate(() =>
    [...document.querySelectorAll('flt-semantics')]
      .map((n) => n.getAttribute('aria-label') || n.innerText || '')
      .join(' | ')
      .slice(0, 400),
  );
  console.log('text', text);
  await page.screenshot({ path: path.join(SHOTS, 'emp-unauth-attendance.png'), fullPage: true });
  fs.writeFileSync(
    path.join(OUT, 'unauth-attendance.json'),
    JSON.stringify({ url: page.url(), text }, null, 2),
  );
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
