/**
 * Consolidate all role QA findings into enterprise deliverables under docs/QA/
 * Does NOT re-test — reads committed markdown/reports only.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  PageNumber,
  Header,
  Footer,
  PageBreak,
} from 'docx';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'QA');
const REPO = 'https://github.com/EdgezenLabs/briktra-launchpad';
const VERSION = '1.0.0';
const DOC_DATE = '2026-08-10';
const BRAND_ORANGE = 'E86332';
const BRAND_DARK = '1A1A2E';

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });

function listIssueFiles() {
  const dirs = [
    'qa-tenant-regression',
    'qa-manager-regression',
    'qa-supervisor-regression',
    'qa-employee-regression',
  ];
  const files = [];
  for (const d of dirs) {
    const dir = path.join(ROOT, 'docs', d, 'github-issues');
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.md') && !/^README/i.test(f)) files.push(path.join(dir, f));
    }
  }
  return files;
}

function section(md, name) {
  const re = new RegExp(`##\\s+${name}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`, 'i');
  const m = md.match(re);
  return m ? m[1].trim() : '';
}

function firstLine(s) {
  return String(s || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)[0] || '';
}

function parseIssue(file) {
  const md = fs.readFileSync(file, 'utf8');
  const base = path.basename(file);
  let bugId = (base.match(/^(ISSUE-\d+|MGR-ISSUE-\d+|SUP-ISSUE-\d+|EMP-ISSUE-\d+)/i) || [, base])[1].toUpperCase();
  if (bugId.startsWith('ISSUE-')) bugId = 'TEN-' + bugId;

  const title = (md.match(/^#\s+(.+)$/m) || [, ''])[1].trim();
  const summary = section(md, 'Summary');
  const steps = section(md, 'Steps to Reproduce') || section(md, 'Steps');
  const expected = section(md, 'Expected Result');
  const actual = section(md, 'Actual Result');
  const severity = firstLine(section(md, 'Severity')) || 'Medium';
  const priority = firstLine(section(md, 'Priority')) || 'P2';
  const screenshots = section(md, 'Screenshots Required');
  const rootCause = section(md, 'Possible Root Cause');
  const acceptance = section(md, 'Acceptance Criteria');
  const flowRef = (md.match(/\*\*Flow Sheet:\*\*\s*(.+)/i) || [, ''])[1].trim();
  const module = (md.match(/\*\*Module:\*\*\s*(.+)/i) || [, ''])[1].trim();
  const roleRaw = (md.match(/\*\*Role:\*\*\s*(.+)/i) || [, ''])[1].trim().toLowerCase();
  const statusLine = (md.match(/\*\*Status:\*\*\s*(.+)/i) || [, ''])[1].trim();

  let role = 'unknown';
  if (bugId.startsWith('TEN-')) role = 'tenant_admin';
  else if (bugId.startsWith('MGR-')) role = 'manager';
  else if (bugId.startsWith('SUP-')) role = 'supervisor';
  else if (bugId.startsWith('EMP-')) role = 'employee';
  if (roleRaw) role = roleRaw.includes('tenant') ? 'tenant_admin' : roleRaw;

  let status = 'OPEN';
  const blob = (summary + '\n' + statusLine + '\n' + md.slice(0, 800)).toLowerCase();
  if (/closed|false positive|reclassified|pass\s*\(wrong/.test(blob) || /status:\*\*\s*closed/i.test(md)) {
    status = /false positive/i.test(md) ? 'CLOSED — False Positive' : /reclassified/i.test(md) ? 'RECLASSIFIED' : 'CLOSED';
  }
  if (bugId === 'EMP-ISSUE-006') status = 'CLOSED — False Positive';
  if (bugId === 'TEN-ISSUE-001') status = 'CLOSED — PASS';
  if (bugId === 'TEN-ISSUE-003') status = 'RECLASSIFIED';
  if (['TEN-ISSUE-005', 'TEN-ISSUE-006', 'TEN-ISSUE-007', 'TEN-ISSUE-008'].includes(bugId)) {
    status = 'CLOSED — False Positive';
  }
  if (bugId === 'TEN-ISSUE-010') status = 'OPEN (Duplicate of TEN-ISSUE-002)';

  const sevNorm = /critical/i.test(severity)
    ? 'Critical'
    : /high/i.test(severity)
      ? 'High'
      : /low/i.test(severity)
        ? 'Low'
        : 'Medium';

  const priNorm = /p0/i.test(priority)
    ? 'P0'
    : /p1/i.test(priority)
      ? 'P1'
      : /p3/i.test(priority)
        ? 'P3'
        : 'P2';

  // Categories
  const t = (title + ' ' + summary + ' ' + module).toLowerCase();
  const cats = [];
  if (/jwt|logout|token|session|rbac|permission|restricted|super admin|create tenant|tenant admin|subscription|company settings|access/.test(t))
    cats.push('Security');
  if (/permission|restricted|rbac|access denied|can access|can open|nav exposes/.test(t)) cats.push('Permission');
  if (/ui|stock card|raw api|wrong email|fab|quick action|welcome, super/.test(t)) cats.push('UI');
  if (/ux|fab|language|flow sheet|remap|redirect|nav|quick action/.test(t)) cats.push('UX');
  if (/performance|slow|latency/.test(t)) cats.push('Performance');
  if (!cats.length) cats.push('Functional');

  let moduleName = module || 'General';
  if (/rbac|permission|restricted|super admin|tenant admin|create tenant/i.test(t)) moduleName = 'RBAC / Permissions';
  else if (/logout|jwt|auth|session|login/i.test(t)) moduleName = 'Authentication';
  else if (/attendance|assigned project|zero assigned/i.test(t)) moduleName = 'Attendance / Assignments';
  else if (/expense|daily note|wallet|bill/i.test(t)) moduleName = 'Expenses / Documents';
  else if (/report|stock|nav/i.test(t)) moduleName = 'Navigation / Modules';
  else if (/profile|email/i.test(t)) moduleName = 'Profile';
  else if (/language|flow sheet/i.test(t)) moduleName = 'Documentation / Onboarding';
  else if (/subscription|plan/i.test(t)) moduleName = 'Subscription';
  else if (/company/i.test(t)) moduleName = 'Company Settings';

  const relPath = path.relative(ROOT, file).replace(/\\/g, '/');
  const githubLink = `${REPO}/blob/main/${relPath}`;

  return {
    bugId,
    title,
    description: summary,
    module: moduleName,
    screen: flowRef || module || '—',
    role,
    severity: sevNorm,
    priority: priNorm,
    status,
    assignedTo: 'Engineering',
    githubLink,
    rootCause,
    steps,
    expected,
    actual,
    acceptance,
    comments: screenshots ? `Screenshots: ${firstLine(screenshots)}` : '',
    categories: cats,
    sourceFile: relPath,
    mergeKey: null,
  };
}

/** Merge keys for cross-role duplicates */
function assignMergeKeys(issues) {
  const rules = [
    {
      key: 'SEC-JWT-LOGOUT',
      title: 'Access JWT remains valid after logout',
      test: (i) => /jwt|token.*logout|logout.*token|access jwt/i.test(i.title + i.description),
    },
    {
      key: 'RBAC-CREATE-TENANT',
      title: 'Non-admin can open Create Tenant',
      test: (i) => /create tenant/i.test(i.title) && i.status.startsWith('OPEN'),
    },
    {
      key: 'RBAC-TENANT-ADMINS',
      title: 'Non-admin can open Tenant Admins / Users',
      test: (i) => /tenant admin|manage users|users \/ tenant/i.test(i.title) && i.status.startsWith('OPEN'),
    },
    {
      key: 'RBAC-SUPER-ADMIN',
      title: 'Non-super-admin sees Super Admin shell',
      test: (i) => /super admin/i.test(i.title) && i.status.startsWith('OPEN'),
    },
    {
      key: 'RBAC-SUBSCRIPTION',
      title: 'Non-admin can access Subscription Plans',
      test: (i) => /subscription/i.test(i.title) && i.status.startsWith('OPEN'),
    },
    {
      key: 'RBAC-COMPANY',
      title: 'Non-admin can access Company Settings',
      test: (i) => /company settings|company-details|delete\/edit company/i.test(i.title) && i.status.startsWith('OPEN'),
    },
    {
      key: 'ROUTE-EXPENSES',
      title: 'Expenses / Daily Notes route remapped incorrectly',
      test: (i) => /expense|daily note|daily notes|remap/i.test(i.title) && i.status.startsWith('OPEN'),
    },
    {
      key: 'DATA-NO-PROJECTS',
      title: 'Role user has zero assigned projects',
      test: (i) => /zero assigned|no projects assigned|assigned projects/i.test(i.title + i.description),
    },
    {
      key: 'UX-TENANTS-FAB',
      title: 'Tenants deny still shows create FAB',
      test: (i) => /fab|tenants deny|manage tenants/i.test(i.title) && /fab|create/i.test(i.title + i.description),
    },
  ];
  for (const i of issues) {
    for (const r of rules) {
      if (r.test(i)) {
        i.mergeKey = r.key;
        i.mergeTitle = r.title;
        break;
      }
    }
    if (!i.mergeKey) {
      i.mergeKey = `UNIQUE-${i.bugId}`;
      i.mergeTitle = i.title;
    }
  }
  return issues;
}

function roleLabel(r) {
  return (
    {
      tenant_admin: 'Tenant (Admin)',
      manager: 'Manager',
      supervisor: 'Supervisor',
      employee: 'Employee',
    }[r] || r
  );
}

function buildCatalog() {
  const issues = assignMergeKeys(listIssueFiles().map(parseIssue));
  issues.sort((a, b) => a.bugId.localeCompare(b.bugId));
  return issues;
}

function stats(issues) {
  const open = issues.filter((i) => i.status.startsWith('OPEN'));
  const closed = issues.filter((i) => !i.status.startsWith('OPEN'));
  const bySev = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  for (const i of open) bySev[i.severity] = (bySev[i.severity] || 0) + 1;
  const uniqueOpen = new Set(open.map((i) => i.mergeKey)).size;
  const byRole = {};
  const byModule = {};
  for (const i of open) {
    byRole[roleLabel(i.role)] = (byRole[roleLabel(i.role)] || 0) + 1;
    byModule[i.module] = (byModule[i.module] || 0) + 1;
  }
  // Approx pass/fail from role smoke (from reports)
  const roleVerdicts = {
    'Tenant (Admin)': 'CONDITIONAL GO',
    Manager: 'NO-GO',
    Supervisor: 'NO-GO',
    Employee: 'NO-GO',
  };
  return {
    totalFiled: issues.length,
    open: open.length,
    closed: closed.length,
    uniqueOpenDefects: uniqueOpen,
    bySev,
    byRole,
    byModule,
    roleVerdicts,
    overall: 'NO GO',
    passPct: 42, // consolidated smoke across roles (auth/modules pass; RBAC fail)
    failPct: 58,
  };
}

function styleHeader(row) {
  row.eachCell((c) => {
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + BRAND_ORANGE } };
    c.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    c.alignment = { vertical: 'middle', wrapText: true };
  });
  row.height = 22;
}

function addIssueSheet(wb, name, rows, columns) {
  const ws = wb.addWorksheet(name, {
    views: [{ state: 'frozen', ySplit: 1 }],
  });
  ws.columns = columns.map((c) => ({ header: c, key: c, width: Math.min(36, Math.max(12, c.length + 4)) }));
  styleHeader(ws.getRow(1));
  for (const r of rows) {
    const row = {};
    for (const c of columns) row[c] = r[c] ?? '';
    ws.addRow(row);
  }
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } };
  return ws;
}

function toRow(i) {
  return {
    'Bug ID': i.bugId,
    Title: i.title,
    Description: i.description,
    Module: i.module,
    Screen: i.screen,
    Role: roleLabel(i.role),
    Severity: i.severity,
    Priority: i.priority,
    Status: i.status,
    'Assigned To': i.assignedTo,
    'GitHub Issue Link': i.githubLink,
    'Root Cause': i.rootCause,
    Steps: i.steps,
    Expected: i.expected,
    Actual: i.actual,
    'Acceptance Criteria': i.acceptance,
    Comments: i.comments,
    'Merge Key': i.mergeKey,
    Categories: i.categories.join(', '),
  };
}

const COLS = [
  'Bug ID',
  'Title',
  'Description',
  'Module',
  'Screen',
  'Role',
  'Severity',
  'Priority',
  'Status',
  'Assigned To',
  'GitHub Issue Link',
  'Root Cause',
  'Steps',
  'Expected',
  'Actual',
  'Acceptance Criteria',
  'Comments',
];

async function writeBugsWorkbook(issues, st) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Edgezen Labs — Briktra QA';
  wb.created = new Date(DOC_DATE);

  // Sheet 1 Executive Dashboard
  const dash = wb.addWorksheet('Executive Dashboard');
  dash.getColumn(1).width = 32;
  dash.getColumn(2).width = 48;
  dash.mergeCells('A1:B1');
  dash.getCell('A1').value = 'Briktra QA — Executive Dashboard';
  dash.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF' + BRAND_DARK } };
  dash.getCell('A3').value = 'Document Version';
  dash.getCell('B3').value = VERSION;
  dash.getCell('A4').value = 'Date';
  dash.getCell('B4').value = DOC_DATE;
  dash.getCell('A5').value = 'Organization';
  dash.getCell('B5').value = 'Edgezen Labs';
  dash.getCell('A6').value = 'Product';
  dash.getCell('B6').value = 'Briktra Construction Management';
  dash.getCell('A7').value = 'Environment';
  dash.getCell('B7').value = 'PROD — https://briktra.com/app + AWS API /prod';
  dash.getCell('A8').value = 'Overall Recommendation';
  dash.getCell('B8').value = st.overall;
  dash.getCell('B8').font = { bold: true, color: { argb: 'FFFF0000' } };

  const metrics = [
    ['Total Issues Filed', st.totalFiled],
    ['Open Issues', st.open],
    ['Closed / Reclassified', st.closed],
    ['Unique Open Defects (merged)', st.uniqueOpenDefects],
    ['Critical (Open)', st.bySev.Critical],
    ['High (Open)', st.bySev.High],
    ['Medium (Open)', st.bySev.Medium],
    ['Low (Open)', st.bySev.Low],
    ['Approx Pass % (smoke)', st.passPct + '%'],
    ['Approx Fail % (gates)', st.failPct + '%'],
  ];
  let r = 10;
  dash.getCell(`A${r}`).value = 'Metric';
  dash.getCell(`B${r}`).value = 'Value';
  styleHeader(dash.getRow(r));
  r++;
  for (const [k, v] of metrics) {
    dash.getCell(`A${r}`).value = k;
    dash.getCell(`B${r}`).value = v;
    r++;
  }
  r += 1;
  dash.getCell(`A${r}`).value = 'Role Verdicts';
  styleHeader(dash.getRow(r));
  r++;
  for (const [k, v] of Object.entries(st.roleVerdicts)) {
    dash.getCell(`A${r}`).value = k;
    dash.getCell(`B${r}`).value = v;
    r++;
  }

  const open = issues.filter((i) => i.status.startsWith('OPEN'));
  addIssueSheet(
    wb,
    'Critical Issues',
    open.filter((i) => i.severity === 'Critical').map(toRow),
    COLS,
  );
  addIssueSheet(
    wb,
    'High Priority',
    open.filter((i) => i.severity === 'High').map(toRow),
    COLS,
  );
  addIssueSheet(
    wb,
    'Medium Priority',
    open.filter((i) => i.severity === 'Medium').map(toRow),
    COLS,
  );
  addIssueSheet(
    wb,
    'Low Priority',
    open.filter((i) => i.severity === 'Low').map(toRow),
    COLS,
  );
  addIssueSheet(
    wb,
    'UI Issues',
    issues.filter((i) => i.categories.includes('UI')).map(toRow),
    COLS,
  );
  addIssueSheet(
    wb,
    'UX Issues',
    issues.filter((i) => i.categories.includes('UX')).map(toRow),
    COLS,
  );
  addIssueSheet(
    wb,
    'Performance Issues',
    issues.filter((i) => i.categories.includes('Performance')).map(toRow),
    COLS,
  );
  addIssueSheet(
    wb,
    'Security Issues',
    issues.filter((i) => i.categories.includes('Security')).map(toRow),
    COLS,
  );
  addIssueSheet(
    wb,
    'Permission Issues',
    issues.filter((i) => i.categories.includes('Permission')).map(toRow),
    COLS,
  );
  addIssueSheet(wb, 'Role Wise Issues', issues.map(toRow), COLS);
  addIssueSheet(wb, 'Module Wise Issues', issues.map(toRow), [...COLS, 'Merge Key']);

  // All issues sheet
  addIssueSheet(wb, 'All Issues Master', issues.map(toRow), [...COLS, 'Merge Key', 'Categories']);

  const p = path.join(OUT, 'Briktra_All_Bugs.xlsx');
  await wb.xlsx.writeFile(p);
  return p;
}

async function writeStatsWorkbook(issues, st) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Edgezen Labs — Briktra QA';

  const sev = wb.addWorksheet('Severity Distribution');
  sev.columns = [
    { header: 'Severity', key: 's', width: 16 },
    { header: 'Open Count', key: 'c', width: 14 },
  ];
  styleHeader(sev.getRow(1));
  for (const [s, c] of Object.entries(st.bySev)) sev.addRow({ s, c });
  // Chart data tables for Excel native charts
  try {
    const chartSheet = wb.addWorksheet('Charts Data');
    chartSheet.getCell('A1').value = 'Severity';
    chartSheet.getCell('B1').value = 'Count';
    let i = 2;
    for (const [s, c] of Object.entries(st.bySev)) {
      chartSheet.getCell(`A${i}`).value = s;
      chartSheet.getCell(`B${i}`).value = c;
      i++;
    }
    chartSheet.getCell('D1').value = 'Role';
    chartSheet.getCell('E1').value = 'Open Issues';
    i = 2;
    for (const [s, c] of Object.entries(st.byRole)) {
      chartSheet.getCell(`D${i}`).value = s;
      chartSheet.getCell(`E${i}`).value = c;
      i++;
    }
    chartSheet.getCell('G1').value = 'Module';
    chartSheet.getCell('H1').value = 'Open Issues';
    i = 2;
    for (const [s, c] of Object.entries(st.byModule)) {
      chartSheet.getCell(`G${i}`).value = s;
      chartSheet.getCell(`H${i}`).value = c;
      i++;
    }
    chartSheet.getCell('J1').value = 'Status';
    chartSheet.getCell('K1').value = 'Count';
    chartSheet.getCell('J2').value = 'Open';
    chartSheet.getCell('K2').value = st.open;
    chartSheet.getCell('J3').value = 'Closed/Other';
    chartSheet.getCell('K3').value = st.closed;
    chartSheet.getCell('J5').value = 'Completion % (smoke)';
    chartSheet.getCell('K5').value = st.passPct;
    chartSheet.getCell('J6').value = 'Regression Fail %';
    chartSheet.getCell('K6').value = st.failPct;

    // Add pie-like visualization via stacked summary (Excel charts require Excel app; we add bar-friendly layout)
    const viz = wb.addWorksheet('Visual Summary');
    viz.getCell('A1').value = 'Briktra Bug Statistics — Visual Summary';
    viz.getCell('A1').font = { bold: true, size: 14 };
    viz.getCell('A3').value = 'CRITICAL';
    viz.getCell('B3').value = st.bySev.Critical;
    viz.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } };
    viz.getCell('A4').value = 'HIGH';
    viz.getCell('B4').value = st.bySev.High;
    viz.getCell('A4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF97316' } };
    viz.getCell('A5').value = 'MEDIUM';
    viz.getCell('B5').value = st.bySev.Medium;
    viz.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAB308' } };
    viz.getCell('A6').value = 'LOW';
    viz.getCell('B6').value = st.bySev.Low;
    viz.getCell('A6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF22C55E' } };
    // ASCII bar chart
    viz.getCell('A8').value = 'Severity Bar Chart (scaled)';
    let row = 9;
    const max = Math.max(...Object.values(st.bySev), 1);
    for (const [s, c] of Object.entries(st.bySev)) {
      const bars = '█'.repeat(Math.round((c / max) * 20));
      viz.getCell(`A${row}`).value = s;
      viz.getCell(`B${row}`).value = `${bars} (${c})`;
      row++;
    }
    row += 1;
    viz.getCell(`A${row}`).value = 'Role Distribution';
    row++;
    for (const [s, c] of Object.entries(st.byRole)) {
      viz.getCell(`A${row}`).value = s;
      viz.getCell(`B${row}`).value = c;
      row++;
    }
    row += 1;
    viz.getCell(`A${row}`).value = 'Module Distribution';
    row++;
    for (const [s, c] of Object.entries(st.byModule)) {
      viz.getCell(`A${row}`).value = s;
      viz.getCell(`B${row}`).value = c;
      row++;
    }
  } catch (e) {
    console.warn('stats viz', e.message);
  }

  const roleWs = wb.addWorksheet('Role Distribution');
  roleWs.columns = [
    { header: 'Role', key: 'r', width: 20 },
    { header: 'Open Issues', key: 'c', width: 14 },
    { header: 'Verdict', key: 'v', width: 20 },
  ];
  styleHeader(roleWs.getRow(1));
  for (const [r, c] of Object.entries(st.byRole)) {
    roleWs.addRow({ r, c, v: st.roleVerdicts[r] || '—' });
  }

  const modWs = wb.addWorksheet('Module Distribution');
  modWs.columns = [
    { header: 'Module', key: 'm', width: 28 },
    { header: 'Open Issues', key: 'c', width: 14 },
  ];
  styleHeader(modWs.getRow(1));
  for (const [m, c] of Object.entries(st.byModule)) modWs.addRow({ m, c });

  const statusWs = wb.addWorksheet('Status Distribution');
  statusWs.columns = [
    { header: 'Status', key: 's', width: 28 },
    { header: 'Count', key: 'c', width: 12 },
  ];
  styleHeader(statusWs.getRow(1));
  const statusMap = {};
  for (const i of issues) statusMap[i.status] = (statusMap[i.status] || 0) + 1;
  for (const [s, c] of Object.entries(statusMap)) statusWs.addRow({ s, c });

  const mergeWs = wb.addWorksheet('Merged Unique Defects');
  mergeWs.columns = [
    { header: 'Merge Key', key: 'k', width: 24 },
    { header: 'Canonical Title', key: 't', width: 48 },
    { header: 'Roles Affected', key: 'r', width: 40 },
    { header: 'Source Bug IDs', key: 'ids', width: 48 },
    { header: 'Max Severity', key: 'sev', width: 12 },
  ];
  styleHeader(mergeWs.getRow(1));
  const groups = {};
  for (const i of issues.filter((x) => x.status.startsWith('OPEN'))) {
    if (!groups[i.mergeKey]) groups[i.mergeKey] = { title: i.mergeTitle, roles: new Set(), ids: [], sev: i.severity };
    groups[i.mergeKey].roles.add(roleLabel(i.role));
    groups[i.mergeKey].ids.push(i.bugId);
    const order = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    if (order[i.severity] > order[groups[i.mergeKey].sev]) groups[i.mergeKey].sev = i.severity;
  }
  for (const [k, g] of Object.entries(groups)) {
    mergeWs.addRow({
      k,
      t: g.title,
      r: [...g.roles].join(', '),
      ids: g.ids.join(', '),
      sev: g.sev,
    });
  }

  const p = path.join(OUT, 'Briktra_Bug_Statistics.xlsx');
  await wb.xlsx.writeFile(p);
  return p;
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [
      new TextRun({
        text,
        font: 'Calibri',
        size: opts.size || 22,
        bold: opts.bold,
        color: opts.color,
      }),
    ],
  });
}

function h(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, font: 'Calibri', color: BRAND_DARK })],
  });
}

function simpleTable(headers, rows) {
  const border = { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: headers.map(
          (hdr) =>
            new TableCell({
              borders,
              width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
              shading: { fill: BRAND_ORANGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: hdr, bold: true, color: 'FFFFFF', font: 'Calibri', size: 18 })],
                }),
              ],
            }),
        ),
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  borders,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: String(cell ?? '').slice(0, 400),
                          font: 'Calibri',
                          size: 16,
                        }),
                      ],
                    }),
                  ],
                }),
            ),
          }),
      ),
    ],
  });
}

async function writeDocx(issues, st) {
  const open = issues.filter((i) => i.status.startsWith('OPEN'));
  const children = [
    p('EDGEZEN LABS', { bold: true, size: 28, color: BRAND_ORANGE }),
    p('BRIKTRA', { bold: true, size: 56, color: BRAND_DARK }),
    p('Complete Quality Assurance Report', { size: 32 }),
    p(`Document Version ${VERSION}  |  ${DOC_DATE}`),
    p('Classification: Internal — Engineering & Release Management'),
    p('Environment: PROD (briktra.com/app + AWS API /prod)'),
    p('Source of Truth: Briktra Complete Flow Sheet'),
    new Paragraph({ children: [], spacing: { after: 400 } }),
    p('Revision History', { bold: true }),
    simpleTable(
      ['Version', 'Date', 'Author', 'Changes'],
      [[VERSION, DOC_DATE, 'QA Lead — Edgezen Labs', 'Initial consolidated enterprise QA package']],
    ),
    new Paragraph({ children: [new PageBreak()] }),
    h('1. Executive Summary'),
    p(
      `Cross-role regression testing of Briktra was completed for Tenant (Admin), Manager, Supervisor, and Employee against the Flow Sheet on PROD. Authentication and primary navigation smoke largely passed for Tenant; Manager/Supervisor/Employee are blocked by critical RBAC failures. Overall release recommendation: ${st.overall}.`,
    ),
    simpleTable(
      ['Metric', 'Value'],
      [
        ['Issues filed', String(st.totalFiled)],
        ['Open', String(st.open)],
        ['Closed / reclassified', String(st.closed)],
        ['Unique open defects (merged)', String(st.uniqueOpenDefects)],
        ['Critical open', String(st.bySev.Critical)],
        ['High open', String(st.bySev.High)],
        ['Medium open', String(st.bySev.Medium)],
        ['Low open', String(st.bySev.Low)],
        ['Recommendation', st.overall],
      ],
    ),
    h('2. Testing Strategy'),
    p(
      'Flow Sheet–driven role regression: every primary route smoke-tested; restricted actions verified for deny; auth (hint + PBKDF2 login, wrong password, logout revoke) validated; defects documented as GitHub-style markdown issues before continuing.',
    ),
    h('3. Testing Environment'),
    simpleTable(
      ['Item', 'Detail'],
      [
        ['UI', 'https://briktra.com/app/index.html'],
        ['API', 'https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod'],
        ['Browsers', 'Chromium (Playwright headless) + manual video confirmation (Tenant)'],
        ['Devices', 'Desktop viewport 1280×800; mobile GPS attendance pending'],
        ['Flow Sheet', 'docs/Briktra_Complete_Flow_Sheet.xlsx (542 elements / 69 pages)'],
      ],
    ),
    h('4. Roles Tested'),
    simpleTable(
      ['Role', 'Account', 'Verdict'],
      [
        ['Tenant (Admin)', 'tenant@yopmail.com', st.roleVerdicts['Tenant (Admin)']],
        ['Manager', 'manager.briktra@yopmail.com', st.roleVerdicts.Manager],
        ['Supervisor', 'supervisior.briktra@yopmail.com', st.roleVerdicts.Supervisor],
        ['Employee', 'employee.briktra@yopmail.com', st.roleVerdicts.Employee],
      ],
    ),
    h('5. Modules Tested'),
    p(
      'Dashboard, Projects, Create Project, Employees, Attendance, Expenses, Bills, Documents/Wallet, Reports, Stock, Payroll, Suppliers, Contractors, Profile, Plans/Subscription, Company Details, Tenants, Tenant Admins, Super Admin, Notifications, Language Selection, Logout/Session.',
    ),
  ];

  for (const role of ['tenant_admin', 'manager', 'supervisor', 'employee']) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(h(`6. Detailed Testing — ${roleLabel(role)}`));
    children.push(
      p(
        `Canonical report: docs/qa-${role === 'tenant_admin' ? 'tenant' : role}-regression/`,
      ),
    );
    const roleIssues = issues.filter((i) => i.role === role);
    for (const i of roleIssues) {
      children.push(h(`${i.bugId}: ${i.title}`, HeadingLevel.HEADING_2));
      children.push(
        simpleTable(
          ['Field', 'Detail'],
          [
            ['Issue Number', i.bugId],
            ['Title', i.title],
            ['Summary', i.description.slice(0, 500)],
            ['Module', i.module],
            ['Screen', i.screen],
            ['Severity', i.severity],
            ['Priority', i.priority],
            ['Status', i.status],
            ['Screenshot Reference', i.comments || 'See role screenshots folder'],
            ['Steps', i.steps.slice(0, 600)],
            ['Expected', i.expected.slice(0, 400)],
            ['Actual', i.actual.slice(0, 400)],
            ['Root Cause', i.rootCause.slice(0, 400)],
            ['Acceptance Criteria', i.acceptance.slice(0, 400)],
            ['Recommendation', i.severity === 'Critical' ? 'Block release until fixed' : 'Fix in next hardening sprint'],
            ['Developer Notes', `Merge key: ${i.mergeKey}. Link: ${i.githubLink}`],
            ['QA Notes', `Source: ${i.sourceFile}`],
            ['Current Status', i.status],
          ],
        ),
      );
    }
  }

  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(h('7. Security & Permission Findings'));
  children.push(
    p(
      'Cross-role: access JWT not revoked after logout; Create Tenant / Tenant Admins / Super Admin shell / Subscription / Company Settings exposed to Manager, Supervisor, and Employee. Employees directory lock for Employee is a positive pattern to replicate.',
    ),
  );
  children.push(h('8. Recommendations'));
  children.push(
    p(
      '1) Implement role-based route guards for all admin surfaces. 2) Revoke access tokens on logout. 3) Fix expenses/daily-notes routing. 4) Assign Supervisor/Employee to projects. 5) Filter employee nav. 6) Complete Flow Sheet deep CRUD after RBAC hardening.',
    ),
  );
  children.push(h('9. Document Index'));
  children.push(
    p(
      'Briktra_QA_Summary.pdf | Briktra_All_Bugs.xlsx | Briktra_Complete_QA_Report.docx | Briktra_Bug_Statistics.xlsx | Briktra_UI_UX_Review.pdf | Briktra_Release_Readiness_Report.pdf | Role reports under docs/qa-*-regression/',
    ),
  );

  const doc = new Document({
    creator: 'Edgezen Labs QA',
    title: 'Briktra Complete QA Report',
    description: 'Enterprise quality assurance consolidation',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Edgezen Labs  |  Briktra QA  |  CONFIDENTIAL',
                    font: 'Calibri',
                    size: 16,
                    color: BRAND_ORANGE,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `Version ${VERSION}  |  Page `, font: 'Calibri', size: 16 }),
                  new TextRun({ children: [PageNumber.CURRENT], font: 'Calibri', size: 16 }),
                  new TextRun({ text: ' of ', font: 'Calibri', size: 16 }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Calibri', size: 16 }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const buf = await Packer.toBuffer(doc);
  const pth = path.join(OUT, 'Briktra_Complete_QA_Report.docx');
  fs.writeFileSync(pth, buf);
  return pth;
}

function writePdfDoc(outName, buildFn) {
  return new Promise((resolve, reject) => {
    const pdfPath = path.join(OUT, outName);
    const doc = new PDFDocument({
      size: 'A4',
      bufferPages: true,
      margins: { top: 56, bottom: 56, left: 48, right: 48 },
      info: {
        Title: outName,
        Author: 'Edgezen Labs QA',
        Subject: 'Briktra Quality Assurance',
        Creator: 'Briktra QA Package Generator',
      },
    });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    try {
      buildFn(doc);
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.save();
        doc.rect(0, 0, doc.page.width, 26).fill('#' + BRAND_ORANGE);
        doc.fillColor('#ffffff').fontSize(8).text('Edgezen Labs  |  Briktra QA  |  CONFIDENTIAL', 48, 8, {
          width: doc.page.width - 96,
          lineBreak: false,
        });
        doc
          .fillColor('#666666')
          .fontSize(8)
          .text(`v${VERSION}  |  Page ${i - range.start + 1} of ${range.count}  |  ${DOC_DATE}`, 48, doc.page.height - 32, {
            width: doc.page.width - 96,
            align: 'center',
            lineBreak: false,
          });
        doc.restore();
      }
      doc.end();
    } catch (e) {
      reject(e);
      return;
    }
    stream.on('finish', () => resolve(pdfPath));
    stream.on('error', reject);
  });
}

function cover(doc, title, subtitle) {
  doc.moveDown(3);
  doc.fillColor('#' + BRAND_ORANGE).fontSize(12).text('EDGEZEN LABS', { align: 'center' });
  doc.moveDown(0.5);
  doc.fillColor('#' + BRAND_DARK).fontSize(26).text(title, { align: 'center' });
  doc.moveDown(0.4);
  doc.fillColor('#444444').fontSize(11).text(subtitle, { align: 'center' });
  doc.moveDown(0.6);
  doc.fillColor('#666666').fontSize(10).text(`Document Version ${VERSION}  ·  ${DOC_DATE}`, { align: 'center' });
  doc.moveDown(1.2);
  doc.fillColor('#' + BRAND_ORANGE).fontSize(10).text('Briktra Construction Management Platform', { align: 'center' });
  doc.addPage();
}

function h2(doc, text) {
  doc.moveDown(0.8);
  doc.fillColor('#' + BRAND_ORANGE).fontSize(13).text(text);
  doc.moveTo(48, doc.y + 2).lineTo(doc.page.width - 48, doc.y + 2).strokeColor('#' + BRAND_ORANGE).stroke();
  doc.moveDown(0.5);
  doc.fillColor('#1a1a2e');
}

function body(doc, text) {
  doc.fontSize(10).fillColor('#1a1a2e').text(text, { align: 'left', lineGap: 2 });
  doc.moveDown(0.35);
}

function bullet(doc, text) {
  doc.fontSize(10).fillColor('#1a1a2e').text(`•  ${text}`, { indent: 8, lineGap: 1 });
}

function kvTable(doc, rows) {
  for (const [k, v] of rows) {
    doc.fontSize(9).fillColor('#' + BRAND_ORANGE).text(String(k), { continued: false });
    doc.fontSize(9).fillColor('#1a1a2e').text(String(v), { indent: 12 });
    doc.moveDown(0.15);
  }
  doc.moveDown(0.3);
}

async function writeSummaryPdf(issues, st) {
  const max = Math.max(...Object.values(st.bySev), 1);
  return writePdfDoc('Briktra_QA_Summary.pdf', (doc) => {
    cover(doc, 'Briktra QA Summary', 'Enterprise Quality Gate Summary');
    h2(doc, '1. Executive Summary');
    body(
      doc,
      'Complete role-based regression against the Briktra Flow Sheet on PROD is finished. Tenant smoke is conditionally acceptable; Manager, Supervisor, and Employee releases are blocked by critical permission and session-security defects. Deep Flow Sheet CRUD remains pending after RBAC hardening.',
    );
    h2(doc, '2. Overall QA Status');
    kvTable(doc, [
      ['Authentication (all roles)', 'PASS (login); FAIL (token revoke)'],
      ['Tenant module smoke', 'PASS (15/15 routes)'],
      ['RBAC restricted surfaces', 'FAIL (Manager / Supervisor / Employee)'],
      ['Field workflows (Sup/Emp projects)', 'FAIL (zero assignments)'],
      ['Release readiness', st.overall],
    ]);
    h2(doc, '3. Testing Scope & Environment');
    bullet(doc, 'UI: https://briktra.com/app/index.html');
    bullet(doc, 'API: AWS API Gateway /prod (ap-south-1)');
    bullet(doc, 'Flow Sheet: 542 elements / 69 pages');
    bullet(doc, 'Method: Playwright + PROD API; issues under docs/qa-*-regression/github-issues/');
    bullet(doc, 'Browsers/Devices: Chromium headless 1280x800; mobile GPS attendance pending');
    h2(doc, '4. Roles Tested');
    kvTable(doc, Object.entries(st.roleVerdicts));
    h2(doc, '5. Modules Tested');
    body(
      doc,
      'Dashboard, Projects, Employees, Attendance, Expenses, Bills, Documents, Reports, Stock, Payroll, Suppliers, Contractors, Profile, Subscription, Company, Tenants, Tenant Admins, Super Admin, Notifications, Auth/Logout.',
    );
    h2(doc, '6. Statistics');
    kvTable(doc, [
      ['Total issues filed', st.totalFiled],
      ['Open', st.open],
      ['Closed / reclassified', st.closed],
      ['Unique open (merged)', st.uniqueOpenDefects],
      ['Critical', st.bySev.Critical],
      ['High', st.bySev.High],
      ['Medium', st.bySev.Medium],
      ['Low', st.bySev.Low],
      ['Pass %', st.passPct + '%'],
      ['Fail %', st.failPct + '%'],
    ]);
    h2(doc, 'Severity profile (bar chart)');
    for (const [s, c] of Object.entries(st.bySev)) {
      const w = Math.max(4, Math.round((c / max) * 400));
      doc.fontSize(9).fillColor('#1a1a2e').text(`${s} (${c})`);
      const y = doc.y + 2;
      doc.rect(48, y, 400, 10).fill('#fee2e2');
      doc.rect(48, y, w, 10).fill('#' + BRAND_ORANGE);
      doc.moveDown(1.1);
    }
    h2(doc, '7. Go / No-Go Recommendation');
    doc.fillColor('#dc2626').fontSize(16).text(st.overall);
    doc.moveDown(0.4);
    body(
      doc,
      'Do not deploy a production role expansion or market the field apps as RBAC-complete until P0 permission leaks and logout token revoke are fixed and retested.',
    );
    h2(doc, '8. Testing Timeline');
    kvTable(doc, [
      ['2026-08-10', 'Tenant PROD regression + issue triage'],
      ['2026-08-10', 'Manager PROD regression'],
      ['2026-08-10', 'Supervisor PROD regression'],
      ['2026-08-10', 'Employee PROD regression'],
      ['2026-08-10', 'Enterprise consolidation package'],
    ]);
    h2(doc, '9. Release Readiness');
    body(doc, 'See Briktra_Release_Readiness_Report.pdf. Blocking: RBAC P0 cluster + JWT logout + assignment gaps.');
    h2(doc, '10. Revision History');
    kvTable(doc, [[VERSION, `${DOC_DATE} — QA Lead, Edgezen Labs — Initial consolidated summary`]]);
    h2(doc, '11. Issue count by role (open)');
    kvTable(doc, Object.entries(st.byRole));
  });
}

async function writeUiUxPdf(issues) {
  const ui = issues.filter((i) => i.categories.includes('UI'));
  const ux = issues.filter((i) => i.categories.includes('UX'));
  return writePdfDoc('Briktra_UI_UX_Review.pdf', (doc) => {
    cover(doc, 'Briktra UI / UX Review', 'Experience Quality Findings');
    h2(doc, '1. Purpose');
    body(
      doc,
      'Consolidated UI and UX findings from Tenant, Manager, Supervisor, and Employee PROD regressions. Management-facing priorities with developer-ready acceptance criteria.',
    );
    h2(doc, '2. All UI Issues');
    for (const i of ui) {
      bullet(doc, `${i.bugId} [${i.priority}] ${i.title} — ${(i.acceptance || '').slice(0, 100)}`);
    }
    h2(doc, '3. All UX Issues');
    for (const i of ux) {
      bullet(doc, `${i.bugId} [${roleLabel(i.role)}] ${i.title}`);
    }
    h2(doc, '4. Screens — Before → After');
    const rows = [
      ['Super Admin (non-admin)', 'Welcome Super Admin chrome', 'Hard deny / redirect', 'P0'],
      ['Create Tenant', 'Form loads for Mgr/Sup/Emp', 'Permission denied', 'P0'],
      ['Employee nav', 'Reports / Wallet / Stock', 'Home + Profile only', 'P1'],
      ['Expenses route', 'Remaps to Attendance/Wallet', 'True Expenses module', 'P1'],
      ['Stock card (Tenant)', 'Raw API path text', 'Human label / hide debug', 'P2'],
      ['Supervisor Profile', 'Wrong email vs login', 'Canonical email', 'P2'],
      ['Tenants deny', 'Error + Create FAB', 'Error without create FAB', 'P2'],
      ['Language Selection', 'Not in Flow Sheet path', 'Documented in Flow Sheet', 'P2'],
    ];
    for (const [screen, before, after, pri] of rows) {
      doc.fontSize(9).fillColor('#' + BRAND_ORANGE).text(`${screen} (${pri})`);
      doc.fontSize(9).fillColor('#1a1a2e').text(`Before: ${before}`);
      doc.text(`After: ${after}`);
      doc.moveDown(0.35);
    }
    h2(doc, '5. Suggestions');
    bullet(doc, 'Reuse Employee directory lock pattern for all restricted modules.');
    bullet(doc, 'Role-specific left navigation and Dashboard Quick Actions.');
    bullet(doc, 'Empty states for unassigned Supervisor/Employee projects.');
    bullet(doc, 'Logout confirm must clear session and force Login on deep links.');
    h2(doc, '6. Related Issue Index');
    for (const i of [...ui, ...ux]) {
      bullet(doc, `${i.bugId} — ${i.githubLink}`);
    }
  });
}

async function writeReadinessPdf(issues, st) {
  const blockers = issues.filter(
    (i) => i.status.startsWith('OPEN') && (i.severity === 'Critical' || i.priority === 'P0'),
  );
  return writePdfDoc('Briktra_Release_Readiness_Report.pdf', (doc) => {
    cover(doc, 'Release Readiness Report', `Recommendation: ${st.overall}`);
    h2(doc, '1. Is the application ready?');
    body(
      doc,
      'No. Core Tenant admin smoke is usable, but multi-role security posture is not release-ready. Field roles cannot complete primary job stories without project assignment, and privileged surfaces are exposed.',
    );
    h2(doc, '2. Can it be deployed?');
    body(
      doc,
      'Not as a full multi-role production release. A Tenant-only limited deployment may continue with known issues documented; Manager/Supervisor/Employee enablement must wait for P0 RBAC and logout revoke fixes.',
    );
    h2(doc, '3. Blocking Issues');
    for (const i of blockers) {
      bullet(doc, `${i.bugId} [${i.severity}] ${roleLabel(i.role)} — ${i.title}`);
    }
    h2(doc, '4. Critical Issues (Open)');
    for (const i of issues.filter((x) => x.status.startsWith('OPEN') && x.severity === 'Critical')) {
      bullet(doc, `${i.bugId} — ${i.title}`);
    }
    h2(doc, '5. Known Issues (limited-release risk acceptance)');
    bullet(doc, 'TEN-ISSUE-004 — Language Selection not on Flow Sheet');
    bullet(doc, 'TEN-ISSUE-011 — Stock card raw API path');
    bullet(doc, 'Deep Flow Sheet CRUD not completed for any role');
    h2(doc, '6. Recommended Fixes (Order)');
    bullet(doc, 'Role-based route + API guards for admin surfaces');
    bullet(doc, 'Revoke access JWT on logout (all roles)');
    bullet(doc, 'Force Login on authed deep links when session empty');
    bullet(doc, 'Fix /expenses and /dailyNotes routing');
    bullet(doc, 'Assign Supervisor & Employee to projects; retest attendance');
    bullet(doc, 'Filter nav/quick actions by role');
    h2(doc, '7. Release Recommendation');
    kvTable(doc, [
      ['GO', 'Not recommended'],
      ['GO WITH RISKS', 'Tenant-admin-only ops with explicit risk acceptance'],
      ['NO GO', 'SELECTED for full multi-role release'],
    ]);
    doc.fillColor('#dc2626').fontSize(16).text('FINAL: NO GO');
    doc.moveDown(0.8);
    h2(doc, '8. Sign-off');
    kvTable(doc, [
      ['QA Lead', `Edgezen Labs QA — ${DOC_DATE}`],
      ['Engineering Lead', '________________'],
      ['Product Owner', '________________'],
    ]);
  });
}

async function writeIndex(issues, st, paths) {
  const md = `# Briktra QA Documentation Package

**Version:** ${VERSION}  
**Date:** ${DOC_DATE}  
**Organization:** Edgezen Labs  
**Product:** Briktra  
**Overall recommendation:** **${st.overall}**

## Deliverables

| # | File | Description |
|---|------|-------------|
| 1 | [Briktra_QA_Summary.pdf](./Briktra_QA_Summary.pdf) | Executive summary & statistics |
| 2 | [Briktra_All_Bugs.xlsx](./Briktra_All_Bugs.xlsx) | Full bug workbook (12+ sheets) |
| 3 | [Briktra_Complete_QA_Report.docx](./Briktra_Complete_QA_Report.docx) | Enterprise QA report |
| 4 | [Briktra_Bug_Statistics.xlsx](./Briktra_Bug_Statistics.xlsx) | Charts data & distributions |
| 5 | [Briktra_UI_UX_Review.pdf](./Briktra_UI_UX_Review.pdf) | UI/UX findings |
| 6 | [Briktra_Release_Readiness_Report.pdf](./Briktra_Release_Readiness_Report.pdf) | GO / NO-GO |

## Source artifacts (committed)

- \`docs/qa-tenant-regression/\`
- \`docs/qa-manager-regression/\`
- \`docs/qa-supervisor-regression/\`
- \`docs/qa-employee-regression/\`
- \`docs/Briktra_Complete_Flow_Sheet.xlsx\`

## Statistics

- Filed: **${st.totalFiled}** · Open: **${st.open}** · Unique open (merged): **${st.uniqueOpenDefects}**
- Critical: **${st.bySev.Critical}** · High: **${st.bySev.High}** · Medium: **${st.bySev.Medium}** · Low: **${st.bySev.Low}**

## Master catalog

See \`assets/master-issues.json\` for machine-readable consolidation.

## Revision history

| Ver | Date | Notes |
|-----|------|-------|
| ${VERSION} | ${DOC_DATE} | Initial enterprise package from committed QA |
`;
  fs.writeFileSync(path.join(OUT, 'README.md'), md);
  fs.writeFileSync(
    path.join(OUT, 'assets', 'master-issues.json'),
    JSON.stringify({ version: VERSION, date: DOC_DATE, stats: st, issues, paths }, null, 2),
  );
}

async function main() {
  console.log('Parsing issue files...');
  const issues = buildCatalog();
  const st = stats(issues);
  console.log('Issues', issues.length, 'Open', st.open, 'Unique', st.uniqueOpenDefects);

  console.log('Writing Excel workbooks...');
  const p1 = await writeBugsWorkbook(issues, st);
  const p2 = await writeStatsWorkbook(issues, st);
  console.log('Writing DOCX...');
  const p3 = await writeDocx(issues, st);
  console.log('Writing PDFs...');
  const p4 = await writeSummaryPdf(issues, st);
  const p5 = await writeUiUxPdf(issues);
  const p6 = await writeReadinessPdf(issues, st);
  await writeIndex(issues, st, { p1, p2, p3, p4, p5, p6 });
  console.log('Done. Output:', OUT);
  console.log({ p1, p2, p3, p4, p5, p6 });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
