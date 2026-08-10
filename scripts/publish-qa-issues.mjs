/**
 * Publish local QA issue markdown files to GitHub (requires GITHUB_TOKEN).
 * Usage: GITHUB_TOKEN=... node scripts/publish-qa-issues.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ISSUES_DIR = path.join(__dirname, '..', 'docs', 'qa-tenant-regression', 'github-issues');
const REPO = process.env.GITHUB_REPO || 'EdgezenLabs/briktra-launchpad';
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.error('Set GITHUB_TOKEN to publish issues');
  process.exit(1);
}

function parseIssue(md) {
  const title = md.match(/^# (.+)/m)?.[1] || 'QA Issue';
  const body = md.replace(/^# .+\n/, '');
  const labels = [];
  if (/Critical/.test(md)) labels.push('severity: critical');
  if (/High/.test(md)) labels.push('severity: high');
  if (/P0/.test(md)) labels.push('priority: P0');
  return { title, body, labels };
}

const files = fs.readdirSync(ISSUES_DIR).filter((f) => f.endsWith('.md'));
for (const file of files) {
  const md = fs.readFileSync(path.join(ISSUES_DIR, file), 'utf8');
  const { title, body } = parseIssue(md);
  const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: `[Tenant QA] ${title}`, body }),
  });
  const json = await res.json();
  if (res.ok) console.log('Created', json.html_url);
  else console.error('Failed', file, json.message);
}
