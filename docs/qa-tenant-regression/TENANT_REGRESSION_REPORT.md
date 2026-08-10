# Tenant (Company Administrator) — Regression Report

**Last updated:** 2026-08-10 (PROD UI confirmed)  
**Role:** Company Owner (`tenant_admin`)  
**Account:** `tenant@yopmail.com` / `Abcd@123`  
**UI:** https://briktra.com/app/index.html  
**API (live app):** `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`  
**Flow Sheet:** `docs/Briktra_Complete_Flow_Sheet.xlsx` — 542 elements, 69 pages  

> **Important:** Earlier runs against `bybdg06o5b.../qa` are **obsolete**. Live Briktra uses **PROD**. Do not use QA results for release decisions.

---

## Executive Summary

| Gate | Result |
|------|--------|
| Login `Abcd@123` (UI + PROD API) | **PASS** |
| Landing Dashboard | **PASS** |
| 15 primary module routes | **PASS** |
| Profile / Employees / Projects data | **PASS** |
| Premium tier (no false Free Trial locks) | **PASS** |
| Logout revokes access JWT | **FAIL** |
| Stock card UI (API path leak) | **FAIL** |
| Flow Sheet every-button deep CRUD | **PENDING** |
| Language Selection in Flow Sheet | **GAP** |

**Verdict:** **CONDITIONAL GO** for Tenant smoke / navigation. **NO-GO** for full regression sign-off until logout revoke + stock UI defect fixed and deep Flow Sheet CRUD completed.

| Metric | Count |
|--------|-------|
| UI routes smoke PASS | 15 / 15 |
| Auth checks PASS | 4 |
| Auth checks FAIL | 1 (post-logout token) |
| Direct API module GETs without signing | BLOCKED (harness only; UI OK) |
| Open issues | 4 |
| Closed / false-positive issues | 6 |

---

## Regression Summary

### Authentication

| ID | Check | Status | Notes |
|----|-------|--------|-------|
| AUTH-01 | UI login Abcd@123 → Dashboard | **PASS** | Playwright + user video |
| AUTH-02 | PROD API hashed login | **PASS** | PBKDF2 + `/auth/login/hint` |
| AUTH-03 | Wrong password | **PASS** | 401 |
| AUTH-04 | `/auth/me` tenant_admin PREMIUM | **PASS** | Test Tenant Admin |
| AUTH-05 | Logout API 200 | **PASS** | |
| AUTH-06 | `/auth/me` after logout | **FAIL** | Still 200 — ISSUE-002/010 |
| AUTH-07 | Language Selection before login | **PASS** (app) / **GAP** (sheet) | ISSUE-004 |

### Module UI smoke (Flow Sheet pages)

| Flow Sheet page | Route | Status | Notes |
|-----------------|-------|--------|-------|
| Dashboard | `/dashboard` | **PASS** | Role tasks + Quick Actions + project |
| Project List | `/projects` | **PASS** | “Briktra” ACTIVE |
| Create Project | `/createProject` | **PASS** | Form + map |
| Employees List | `/employees` | **PASS** | 4 employees |
| Suppliers List | `/suppliers` | **PASS** | Empty state CTA |
| Contractors List | `/contractors` | **PASS** | Empty + filters |
| Bills Management | `/billsList` | **PASS** | Empty (not locked) |
| Document Wallet | `/documentWallet` | **PASS** | Empty company docs |
| Project Reports | `/reportsDashboard` | **PASS** | Select project state |
| Warehouse Stock | `/stockManagement` | **PASS*** | *ISSUE-011 subtitle leak |
| Payroll Management | `/payrollList` | **PASS** | Empty + Calculate |
| Attendance | `/addAttendance` | **PASS** | Empty overview |
| Profile | `/profile` | **PASS** | PREMIUM Active |
| Subscription Plans | `/plans` | **PASS** | PREMIUM Plan Active |
| Company Details | `/company-details` | **PASS** | Complete Company Profile |

Screenshots: `docs/qa-tenant-regression/screenshots/prod-*.png`

### Profile (PROD)

| Field | Value |
|-------|--------|
| Name | Test Tenant Admin |
| Email | tenant@yopmail.com |
| Role | tenant_admin |
| Tenant | TenantAdmin Builders |
| Tier | premium |

---

## Bug Summary

| ID | Title | Severity | Status |
|----|-------|----------|--------|
| ISSUE-001 | Login Abcd@123 fails | Critical | **CLOSED — PASS** (wrong API env) |
| ISSUE-002 | Access JWT valid after logout | High | **OPEN** (confirmed on PROD) |
| ISSUE-003 | Missing X-Request-Signature | Critical | **RECLASSIFIED** — API harness only; UI OK |
| ISSUE-004 | Language Selection not in Flow Sheet | Medium | **OPEN** |
| ISSUE-005 | Profile User ID not found | High | **CLOSED — false positive** (QA/inject) |
| ISSUE-006 | Employees no tenant context | High | **CLOSED — false positive** |
| ISSUE-007 | Premium shows Free Trial locks | Critical | **CLOSED — false positive** |
| ISSUE-008 | Dashboard/Projects redirect login | High | **CLOSED — false positive** |
| ISSUE-010 | PROD JWT after logout | High | **OPEN** (same as 002) |
| ISSUE-011 | Stock card raw API path text | Medium | **OPEN** |

Issue files: `docs/qa-tenant-regression/github-issues/`

---

## UI Review

| Area | Finding | Score |
|------|---------|------:|
| Login / brand | Split orange layout; English after language gate | 8/10 |
| Dashboard | Clear role tasks + quick actions | 8/10 |
| Empty states | Consistent icons + CTAs | 8/10 |
| Stock card | Debug/API path leaked into UI | 4/10 |
| Tier display | PREMIUM badges correct on Profile/Plans | 9/10 |
| Overall UI (smoke) | **7.5 / 10** | |

---

## UX Review

| Area | Finding |
|------|---------|
| Login | Works with documented credentials on prod |
| Navigation | Sidebar + quick actions align with Flow Sheet |
| Empty modules | Helpful CTAs (Create Supplier, Calculate payroll) |
| Logout security | User may believe session ended while token lives |
| Stock | Confusing technical text harms trust |
| **UX score** | **7 / 10** (smoke) |

---

## Performance Review

| Check | Result |
|-------|--------|
| Auth hint + login | &lt; 3s observed |
| Route transitions | ~3–5s settle for screenshots |
| Module load via UI | Acceptable for smoke |
| Deep perf profiling | Not run |

**Performance score:** **7 / 10** (smoke only)

---

## Security Review

| Control | Status |
|---------|--------|
| Client PBKDF2 password hash | **PASS** |
| Plaintext password rejected | **PASS** |
| Access token revoke on logout | **FAIL** |
| Live API = PROD (not QA) | Confirmed |
| Cross-tenant API isolation | Pending signed API harness |
| Request signing (direct scripts) | Required; UI still works |

**Security score:** **6 / 10**

---

## Suggestions

1. Revoke access JWTs on logout (ISSUE-002/010).
2. Fix stock card subtitle binding (ISSUE-011).
3. Add Language Selection to Flow Sheet (ISSUE-004).
4. Point all QA scripts at **PROD** base URL by default.
5. Continue deep Flow Sheet testing (CRUD, validations, every button).
6. Provide signing secret for API automation, or keep UI-first testing.

---

## Artifacts

| Path | Description |
|------|-------------|
| `TENANT_PROD_UI_CONFIRMED.md` | Detailed PROD UI confirmation |
| `TENANT_PROD_REGRESSION.md` | API+UI combined run notes |
| `prod-ui-routes.json` | Route smoke machine results |
| `screenshots/prod-*.png` | Evidence |
| `scripts/ui-login-semantics.mjs` | Proven UI login |
| `scripts/tenant-prod-ui-routes.mjs` | Route walker |
| `scripts/tenant-prod-regression.mjs` | PROD regression runner |

---

## Historical note (obsolete findings)

Documents/results that used `bybdg06o5b.../qa` or token-inject without Flutter session are **superseded**. See `docs/role-exploration/LOGIN_BLOCKER.md` and closed ISSUE-005–008.
