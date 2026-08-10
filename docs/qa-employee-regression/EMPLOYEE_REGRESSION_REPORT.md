# Employee (Site Employee) — Complete Regression Report

**Date:** 2026-08-10  
**Role:** `employee` — Site Employee  
**Account:** `employee.briktra@yopmail.com` / `Employee@123`  
**UI:** https://briktra.com/app/index.html  
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod  
**Flow Sheet:** `docs/Briktra_Complete_Flow_Sheet.xlsx`  
**Script:** `scripts/employee-prod-regression.mjs`  
**Evidence:** `docs/qa-employee-regression/screenshots/emp-*.png`

---

## Executive Summary

Employee login **PASS** on PROD (API + UI). Home correctly routes to `#/employeeAttendanceTap` with Mark Attendance UI. Profile, notifications entry, and wrong-password rejection **PASS**.

**Blockers:**

1. **Critical RBAC leaks** — Reports, Company Settings, Create Project, Subscription Plans, Tenant Admins, Create Tenant, Bills, and Super Admin chrome are reachable via deep link (and Reports is in the left nav).
2. **Zero assigned projects** — Mark Attendance cannot complete (“No projects are assigned to you”).
3. **Logout security** — Access JWT remains valid after `POST /auth/logout`; post-logout deep links do not force Login.

**Verdict: NO-GO** for Employee RBAC and field attendance sign-off.

| Metric | Result |
|--------|--------|
| Auth login UI + API | **PASS** |
| Role = employee | **PASS** |
| Home = employeeAttendanceTap | **PASS** |
| Mark Attendance end-to-end | **FAIL** (no project + GPS) |
| Restricted admin deep-links | **FAIL** (multiple P0) |
| Logout UI (confirm) | **PASS** |
| Token revoke after logout | **FAIL** |
| Issues filed | **13** (1 closed false positive) |

---

## Regression Summary

### Profile (`/auth/me`)

| Field | Value |
|-------|--------|
| Name | Employee |
| Email | employee.briktra@yopmail.com |
| Role | employee |
| Tenant | TenantAdmin Builders |
| Tier | premium |
| Wage | ₹1000 / daily |

### Authentication & Session

| ID | Check | Status |
|----|-------|--------|
| EMP-AUTH-01 | PROD hashed login | **PASS** |
| EMP-AUTH-02 | role=employee | **PASS** |
| EMP-AUTH-03 | Wrong password | **PASS** |
| EMP-AUTH-04 | UI → `#/employeeAttendanceTap` | **PASS** |
| EMP-AUTH-05 | Logout control + confirm → Login | **PASS** (recheck) |
| EMP-AUTH-06 | Access token after logout | **FAIL** |
| EMP-AUTH-07 | Post-logout deep link → Login | **FAIL** (Attendance Locked shell) |
| EMP-SES-01 | Session mid-run | **PASS** |

### Business scenario

| Step | Expected | Status |
|------|----------|--------|
| Open App | Language → Login → Home | **PASS** (must tap Change Language) |
| View Today's Attendance | employeeAttendanceTap | **PASS** (UI) |
| Mark Attendance | Submit for today | **FAIL** — no assigned project; GPS unavailable in harness |
| View Assigned Tasks | Assigned work | **FAIL** / empty — no projects |
| Update Profile | Edit profile affordance | **PASS** (Edit profile visible) |
| Read Notifications | Dashboard / bell | **PASS** (smoke — notifications API 200) |
| Profile | Correct name/email/role | **PASS** |
| Logout | Login screen | **PASS** (after confirm) |

### Restricted (expect DENY)

| Action | Route | Status |
|--------|-------|--------|
| Open Reports | `/reportsDashboard` | **FAIL** — full Project Reports UI |
| Company Settings | `/company-details` | **FAIL** — Complete Company Profile |
| Projects list | `/projects` | **REVIEW** — list opens (empty / assignment) |
| Create Project | `/createProject` | **FAIL** — Create Project form |
| Subscription | `/plans` | **FAIL** — Subscription Plans |
| Users / Tenant Admins | `/tenantAdmins` | **FAIL** — list visible |
| Users / Employees directory | `/employees` | **PASS** — lock message (ISSUE-006 closed) |
| Expenses Approval | `/expenses` | **PASS*** — remapped; not approval UI |
| Bills | `/billsList` | **FAIL** — Bills Management + Create Bill |
| Create Tenant | `/createTenant` | **FAIL** — Create Tenant form |
| Manage Tenants | `/tenants` | **PASS** — permission error |
| Super Admin | `/superAdmin` | **FAIL** — “Welcome, Super Admin” chrome (+ data 403) |
| Delete Attendance | `/addAttendance` | **REVIEW** — empty attendance; no delete proven |

---

## Bug Summary

| ID | Sev | Title | Status |
|----|-----|-------|--------|
| EMP-ISSUE-001 | P0 | Employee can open Reports | OPEN |
| EMP-ISSUE-002 | P0 | Employee can open Company Settings | OPEN |
| EMP-ISSUE-003 | P1 | Employee can open Create Project | OPEN |
| EMP-ISSUE-004 | P0 | Employee can open Subscription | OPEN |
| EMP-ISSUE-005 | P0 | Employee can open Tenant Admins | OPEN |
| EMP-ISSUE-006 | P3 | Employees directory | **CLOSED** — deny UI correct |
| EMP-ISSUE-007 | P1 | Employee can open Bills | OPEN |
| EMP-ISSUE-008 | P0 | Employee can open Create Tenant | OPEN |
| EMP-ISSUE-009 | P0 | Employee sees Super Admin shell | OPEN |
| EMP-ISSUE-010 | P1 | Post-logout deep link not forced to Login | OPEN |
| EMP-ISSUE-011 | P1 | Access JWT valid after logout | OPEN |
| EMP-ISSUE-012 | P1 | Zero assigned projects blocks attendance | OPEN |
| EMP-ISSUE-013 | P1 | Nav exposes Reports / Wallet / Stock | OPEN |

Issue files: `docs/qa-employee-regression/github-issues/`

---

## UI Review

**Score: 5/10**

- Attendance home layout is clear (Select Project, type, TAP TO MARK).
- Left rail and Super Admin / Create Tenant chrome for an employee role are severe IA defects.
- Profile presentation (name, email, Employee + PREMIUM badges, Edit profile) is correct.
- Language selection gate before login is easy to miss in automation (Change Language CTA).

## UX Review

**Score: 4/10**

- “No projects assigned” message is clear but blocks the entire employee job-to-be-done.
- Location Not Available is expected on desktop without GPS — mobile retest required for Mark Attendance.
- Permission denials are inconsistent: Employees directory lock is good; Reports/Plans/Create Tenant show full admin UX.
- Logout confirmation dialog is good; must confirm second Logout.

## Performance Review

**Score: 7/10**

- Login and route transitions ~3–10s headless; acceptable for smoke.
- No dedicated load/perf suite run.

## Security Review

**Score: 2/10**

- Wrong password rejected (**PASS**).
- Employee can reach Create Tenant, Tenant Admins, Subscription, Company Settings, Bills, Reports, Create Project, Super Admin shell (**FAIL**).
- API still returns 200 for several admin GETs under employee token (e.g. bills, plan-config, tenant_admin users list); tenants list correctly 403.
- Access JWT not revoked after logout (**FAIL** — cross-role).
- Post-logout deep link shows feature shell instead of Login (**FAIL**).

## Suggestions

1. **P0:** Gate all admin routes for `role=employee` (same hardening backlog as manager/supervisor).
2. Filter employee left nav to Home + Profile (remove Reports/Wallet/Stock).
3. Assign this employee to a PROD project and re-test Mark Attendance on a device with GPS.
4. Revoke access JWT on logout; force Login on all authed deep links when session is empty.
5. Keep Employees-directory lock pattern; apply the same deny UX to Reports/Plans/Bills/Create Tenant.
6. Complete Flow Sheet click-level: Attendance Type validation, tap submit success/error, Edit Profile save, notification open/read.

## API sample (UI session)

Successful login, assigned lookup, attendance stats, projects, notifications, bills, plan-config — see `docs/qa-employee-regression/results.json`.

## Re-run

```bash
node scripts/employee-prod-regression.mjs
node scripts/employee-logout-recheck.mjs
```
