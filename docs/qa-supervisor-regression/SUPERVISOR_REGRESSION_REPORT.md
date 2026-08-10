# Supervisor (Site Supervisor) — Complete Regression Report

**Date:** 2026-08-10  
**Role:** `supervisor` — Site Supervisor  
**Account:** `supervisior.briktra@yopmail.com` / `Supervisior@123`  
**UI:** https://briktra.com/app/index.html  
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod  
**Flow Sheet:** `docs/Briktra_Complete_Flow_Sheet.xlsx`  
**Script:** `scripts/supervisor-prod-regression.mjs`  

---

## Executive Summary

Supervisor login **PASS**. Dashboard role tasks correctly show **Log Expense** and **My Projects**. However:

1. **No projects assigned** — site scenario (progress, site details) blocked by empty assignment.
2. **Expenses / Daily Notes routes remapped** to Document Wallet.
3. **Critical RBAC failures** — Create Tenant, Tenant Admins, Super Admin shell, Subscription, Company Settings, Create Project all open for supervisor.

**Verdict: NO-GO** for Supervisor RBAC and field-workflow sign-off.

| Metric | Result |
|--------|--------|
| Auth login UI+API | **PASS** |
| Role = supervisor | **PASS** |
| Dashboard role tasks | **PASS** |
| Assigned projects | **FAIL** (0) |
| Expenses / Daily Progress routes | **FAIL** |
| Restricted admin deep-links | **FAIL** (multiple) |
| Issues filed | **12** |

---

## Regression Summary

### Profile (/auth/me)

| Field | Value |
|-------|--------|
| Name | supervisior |
| Login email | supervisior.briktra@yopmail.com |
| Role | supervisor |
| Tenant | TenantAdmin Builders |
| Tier | premium |

### Authentication

| ID | Check | Status |
|----|-------|--------|
| SUP-AUTH-01 | PROD hashed login | **PASS** |
| SUP-AUTH-02 | role=supervisor | **PASS** |
| SUP-AUTH-03 | Wrong password | **PASS** |
| SUP-AUTH-04 | UI → Dashboard | **PASS** |
| SUP-AUTH-05 | Logout control | **PASS** (UI) |
| SUP-AUTH-06 | Token after logout | **FAIL** |

### Site business scenario

| Step | Expected | Status |
|------|----------|--------|
| Arrive at Site / Dashboard | Log Expense + My Projects | **PASS** |
| Mark Attendance | Attendance module | **PASS** (smoke / empty) |
| Add Labour | Employees / Add Labour | **PASS*** (directory opens; over-broad user list) |
| Upload Photos | Document Wallet | **PASS** (empty + camera FAB) |
| Submit Daily Progress | Daily Notes/Updates | **FAIL** → Wallet |
| Create Expense | Expenses | **FAIL** → Wallet |
| Upload Bills | Bills | **PASS** (smoke) |
| View Assigned Project | Projects | **FAIL** — 0 assigned |
| Notifications | Dashboard bell | **PASS** (smoke) |
| Profile | Profile | **PASS*** (wrong email display) |
| Logout | Profile Logout | **PASS** / revoke **FAIL** |

### Module smoke

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Attendance | `/addAttendance` | **PASS** | |
| Employees / Labour | `/employees` | **PASS*** | Sees managers + wages |
| Documents | `/documentWallet` | **PASS** | |
| Daily Notes | `/dailyNotes` | **FAIL** | → documentWallet |
| Daily Updates | `/dailyUpdates` | **FAIL** | → documentWallet |
| Expenses | `/expenses` | **FAIL** | → documentWallet |
| Bills | `/billsList` | **PASS** | |
| Projects | `/projects` | **PASS** empty | No assignment |
| Reports / Stock / etc. | respective | **PASS** | Smoke |

### Restricted (expect DENY)

| Action | Route | Status |
|--------|-------|--------|
| Create / Delete Project | `/createProject` | **FAIL** — form loads |
| Create / Delete Company | `/createTenant` | **FAIL** — form loads |
| Manage Tenants | `/tenants` | **PASS*** data denied / **FAIL** FAB UX (ISSUE-003) |
| Manage Users | `/tenantAdmins` | **FAIL** — list + FAB |
| Super Admin | `/superAdmin` | **FAIL** — “Welcome, Super Admin” |
| Manage Subscription | `/plans` | **FAIL** — full UI |
| Company Settings | `/company-details` | **FAIL** — editable |

Screenshots: `docs/qa-supervisor-regression/screenshots/sup-*.png`

---

## Bug Summary

| ID | Title | Sev | Pri |
|----|-------|-----|-----|
| SUP-ISSUE-001 | Create Project accessible | High | P1 |
| SUP-ISSUE-002 | Create Tenant accessible | Critical | P0 |
| SUP-ISSUE-003 | Tenants deep-link | High | P1 |
| SUP-ISSUE-004 | Tenant Admins accessible | Critical | P0 |
| SUP-ISSUE-005 | Super Admin shell for Supervisor | Critical | P0 |
| SUP-ISSUE-006 | Subscription Plans accessible | High | P1 |
| SUP-ISSUE-007 | Company Settings accessible | High | P1 |
| SUP-ISSUE-008 | JWT after logout | High | P1 |
| SUP-ISSUE-009 | Expenses/Daily Notes → Wallet | High | P1 |
| SUP-ISSUE-010 | Profile wrong email | Medium | P2 |
| SUP-ISSUE-011 | Zero assigned projects | High | P1 |
| SUP-ISSUE-012 | Admin Quick Actions on Dashboard | Medium | P2 |

---

## UI Review

| Area | Finding | Score |
|------|---------|------:|
| Role tasks (Log Expense / My Projects) | Correct vs Manager/Tenant | 8/10 |
| Quick Actions grid | Over-permissioned | 4/10 |
| Empty projects state | Clear copy | 8/10 |
| Super Admin chrome leak | Critical | 2/10 |
| **Overall UI** | **5 / 10** | |

---

## UX Review

- Primary role cards match supervisor job (**good**).
- Cannot run site day without assigned project (**blocker**).
- Expense/progress deep links dump into Wallet (**confusing**).
- Profile email mismatch erodes trust.
- **UX score: 4 / 10**

---

## Performance Review

| Check | Result |
|-------|--------|
| Login to Dashboard | &lt; 10s headless |
| Route navigations | ~3–5s |
| Field upload/CRUD latency | Not measured (routes broken / no project) |

**Performance score: 7 / 10** (smoke)

---

## Security Review

| Control | Status |
|---------|--------|
| Login hash + wrong password | **PASS** |
| Logout token revoke | **FAIL** |
| Create Tenant denied | **FAIL** |
| Tenant Admins denied | **FAIL** |
| Super Admin shell denied | **FAIL** |
| Subscription denied | **FAIL** |
| Company settings denied | **FAIL** |
| Create Project denied | **FAIL** |

**Security score: 3 / 10**

---

## Suggestions

1. **P0:** Role-gate `/createTenant`, `/tenantAdmins`, `/superAdmin` before rendering chrome.
2. **P1:** Assign supervisor to project “Briktra” (or create site assignment) for field QA.
3. **P1:** Fix `/expenses`, `/dailyNotes`, `/dailyUpdates` routing (or document Quick Expense / project-scoped paths in Flow Sheet).
4. **P1:** Restrict `/plans`, `/company-details`, `/createProject` for supervisor by default.
5. **P1:** Revoke access JWT on logout.
6. **P2:** Fix profile email display; filter Dashboard quick actions by role.
7. Re-run site scenario after assignment: attendance, labour add, photo upload, expense, bills, progress.

---

## Artifacts

| Path | Description |
|------|-------------|
| `SUPERVISOR_REGRESSION_REPORT.md` | This report |
| `results.json` | Machine results |
| `screenshots/sup-*.png` | Evidence |
| `github-issues/SUP-ISSUE-*.md` | Defects |
| `scripts/supervisor-prod-regression.mjs` | Runner |
