# Manager (Construction Project Manager) — Complete Regression Report

**Date:** 2026-08-10  
**Role:** `manager` — Construction Project Manager  
**Account:** `manager.briktra@yopmail.com` / `Manager@123`  
**UI:** https://briktra.com/app/index.html  
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod  
**Flow Sheet:** `docs/Briktra_Complete_Flow_Sheet.xlsx` (source of truth)  
**Script:** `scripts/manager-prod-regression.mjs`  

---

## Executive Summary

Manager login and core morning navigation largely work on PROD. **RBAC for restricted admin surfaces is critically broken**: Manager can open Create Tenant, Tenant Admins, Subscription Plans, Company Settings, and a Super Admin chrome that greets them as “Super Admin.”

| Gate | Result |
|------|--------|
| Login UI + API | **PASS** |
| Role = manager | **PASS** |
| Dashboard role tasks (Attendance / Projects / Reports) | **PASS** |
| Projects, Attendance, Documents, Reports, Profile | **PASS** (smoke) |
| Expenses deep link `#/expenses` | **FAIL** → Attendance |
| Restricted: Delete Users / Role Mgmt / Subscription / Company / Create Tenant | **FAIL** (accessible) |
| Restricted: Tenants list data | **PASS** (permission error) with UX gaps |
| Logout token revoke | **FAIL** |

**Verdict: NO-GO** for Manager security / RBAC sign-off. Functional smoke of allowed modules is **CONDITIONAL GO** pending expenses route fix and deep CRUD.

---

## Regression Summary

### Profile

| Field | Value |
|-------|--------|
| Name | Manager |
| Email | manager.briktra@yopmail.com |
| Role | manager |
| Tenant | TenantAdmin Builders |
| Tier | premium |
| Wage | ₹50000 / monthly |

### Authentication

| ID | Check | Status |
|----|-------|--------|
| MGR-AUTH-01 | PROD hashed login Manager@123 | **PASS** |
| MGR-AUTH-02 | `/auth/me` role=manager | **PASS** |
| MGR-AUTH-03 | Wrong password → 401 | **PASS** |
| MGR-AUTH-04 | UI Login → Dashboard | **PASS** |
| MGR-AUTH-05 | Logout control on Profile | **PASS** (UI present) |
| MGR-AUTH-06 | Access token after logout | **FAIL** |

### Morning business scenario

| Step | Expected | Result | Status |
|------|----------|--------|--------|
| Review Dashboard | Manager tasks: Mark Attendance, Projects, Reports | Shown correctly | **PASS** |
| Open Project | Project List / detail | Projects list with “Briktra” | **PASS** |
| Review Labour | Employees | Route loads | **PASS** (smoke) |
| Check Attendance | Mark / Overview | Attendance Overview | **PASS** (empty OK) |
| Approve Expenses | Expenses module | `#/expenses` → Attendance | **FAIL** |
| View Reports | Project Reports | Route loads | **PASS** (smoke) |
| Review Progress | Project progress | 0% on dashboard/list | **PASS** (smoke) |
| Check Notifications | Bell on Dashboard | Bell visible | **PASS** (smoke; not clicked through inbox) |
| Logout | Profile → Logout | Logout button present | **PASS** / token revoke **FAIL** |

### Module smoke (Flow Sheet routes)

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| Dashboard | `/dashboard` | **PASS** | |
| Projects | `/projects` | **PASS** | Edit/Delete icons present — delete needs policy review |
| Attendance | `/addAttendance` | **PASS** | Empty state |
| Expenses | `/expenses` | **FAIL** | Redirects to attendance |
| Documents | `/documentWallet` | **PASS** | |
| Reports | `/reportsDashboard` | **PASS** | |
| Profile | `/profile` | **PASS** | Manager + PREMIUM badges |
| Payroll | `/payrollList` | **PASS** | Smoke |
| Stock | `/stockManagement` | **PASS** | Smoke |
| Suppliers / Contractors / Bills | respective | **PASS** | Smoke |
| Create Project | `/createProject` | **PASS*** | Form loads; Dashboard exposes Add Projects for manager |

### Restricted actions (expect DENY)

| Action | Route | Expected | Actual | Status |
|--------|-------|----------|--------|--------|
| Create Tenant | `/createTenant` | Deny | Full create form | **FAIL** |
| Tenants list | `/tenants` | Deny | Permission error (+ FAB) | **PASS*** / UX **FAIL** |
| Role Management | `/tenantAdmins` | Deny | List + add FAB | **FAIL** |
| Super Admin | `/superAdmin` | Deny | “Welcome, Super Admin” shell | **FAIL** |
| Subscription | `/plans` | Deny | Full plans UI | **FAIL** |
| Company Settings | `/company-details` | Deny | Complete Company Profile | **FAIL** |
| Delete Users | via Employees | Deny | Not fully exercised this run | **PENDING** |

Screenshots: `docs/qa-manager-regression/screenshots/`

---

## Bug Summary

| ID | Title | Severity | Priority |
|----|-------|----------|----------|
| MGR-ISSUE-001 | Access JWT valid after logout | High | P1 |
| MGR-ISSUE-002 | Manager can open Create Tenant | Critical | P0 |
| MGR-ISSUE-003 | Manager can view Tenant Admins | Critical | P0 |
| MGR-ISSUE-004 | Super Admin shell greets Manager as Super Admin | Critical | P0 |
| MGR-ISSUE-005 | Manager can access Subscription Plans | High | P1 |
| MGR-ISSUE-006 | Manager can access Company Settings | High | P1 |
| MGR-ISSUE-007 | `#/expenses` redirects to Attendance | High | P1 |
| MGR-ISSUE-008 | Tenants deny still shows create FAB | Medium | P2 |

Files: `docs/qa-manager-regression/github-issues/`

---

## UI Review

| Area | Finding | Score |
|------|---------|------:|
| Manager Dashboard | Correct role tasks vs Tenant (Attendance first) | 8/10 |
| Profile | Clear Manager + PREMIUM badges | 8/10 |
| Deny screens | Inconsistent — some deny, some full admin UI | 3/10 |
| Super Admin chrome leak | Severe trust/security UI failure | 2/10 |
| **Overall UI** | **5 / 10** | |

---

## UX Review

- Morning path is clear from Dashboard cards (**good**).
- Expenses deep link broken → manager cannot follow “Approve Expenses” without hunting Quick Expense (**poor**).
- Permission errors that still show Super Admin welcome / Create Tenant (**confusing & dangerous**).
- **UX score: 5 / 10**

---

## Performance Review

| Check | Result |
|-------|--------|
| Login | &lt; 10s to Dashboard in headless |
| Route navigations | ~3–5s settle |
| Deep load / approve latency | Not measured |

**Performance score: 7 / 10** (smoke only)

---

## Security Review

| Control | Status |
|---------|--------|
| Password hashing login | **PASS** |
| Wrong password | **PASS** |
| Logout revoke access JWT | **FAIL** |
| Manager blocked from Create Tenant | **FAIL** |
| Manager blocked from Role Management | **FAIL** |
| Manager blocked from Super Admin UI | **FAIL** |
| Manager blocked from Subscription | **FAIL** |
| Manager blocked from Company Settings | **FAIL** |
| Tenants data API | Denied message shown (**partial PASS**) |

**Security score: 3 / 10** — RBAC deep-links are a release blocker.

---

## Suggestions

1. **P0:** Gate `/createTenant`, `/tenantAdmins`, `/superAdmin` by role before rendering any admin chrome.
2. **P0:** Never show “Welcome, Super Admin” unless `role === super_admin`.
3. **P1:** Restrict `/plans` and `/company-details` to `tenant_admin`.
4. **P1:** Fix `/expenses` routing or document Quick Expense path in Flow Sheet for managers.
5. **P1:** Revoke access tokens on logout.
6. Complete remaining Flow Sheet clicks: Mark Now, expense approve, notification inbox, employee delete attempt.
7. Add automated RBAC suite: for each role, assert deny matrix on admin routes.

---

## Artifacts

| Path | Description |
|------|-------------|
| `MANAGER_REGRESSION_REPORT.md` | This report |
| `results.json` | Machine results |
| `screenshots/mgr-*.png` | Evidence |
| `github-issues/MGR-ISSUE-*.md` | Defects |
| `scripts/manager-prod-regression.mjs` | Repro runner |
