# Tenant Role — Live Testing Session

**Last updated:** 2026-08-10  
**Environment:** Live https://briktra.com/app/index.html  
**API:** `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`  
**Account:** `tenant@yopmail.com` / `Abcd@123`  
**Rule:** Prefer login-only; no register unless requested  

---

## 1. Session status: UNBLOCKED

| Step | Action | Result |
|------|--------|--------|
| 1 | Open live app | **PASS** |
| 2 | Login `Abcd@123` (UI) | **PASS** → Dashboard |
| 3 | Login `Abcd@123` (PROD API hashed) | **PASS** 200 |
| 4 | Wrong password | **PASS** 401 |
| 5 | `/auth/me` | **PASS** tenant_admin PREMIUM |

**Obsolete:** Earlier FAIL against QA API (`bybdg06o5b.../qa`) — ignore for current status.

---

## 2. Authentication & session results

| ID | Scenario | Result |
|----|----------|--------|
| TEN-AUTH-01 | Valid login | **PASS** |
| TEN-AUTH-02 | Wrong password | **PASS** |
| TEN-AUTH-04 | `/auth/me` | **PASS** |
| TEN-AUTH-05 | Refresh | Not re-checked this update |
| TEN-AUTH-06 | Logout | **PASS** (API 200) |
| TEN-AUTH-07 | `/auth/me` after logout | **FAIL** — still 200 |

---

## 3. Module / screen results (UI smoke)

| Module | Status |
|--------|--------|
| Dashboard | **PASS** |
| Projects / Create Project | **PASS** |
| Employees | **PASS** (4 users) |
| Suppliers / Contractors / Bills | **PASS** (empty OK) |
| Reports / Attendance / Payroll / Wallet | **PASS** |
| Stock | **PASS*** — ISSUE-011 UI leak |
| Profile / Plans / Company Details | **PASS** |

Full matrix: `docs/qa-tenant-regression/TENANT_REGRESSION_REPORT.md`

---

## 4. Evidence

| Artifact | Path |
|----------|------|
| Canonical report | `docs/qa-tenant-regression/TENANT_REGRESSION_REPORT.md` |
| Screenshots | `docs/qa-tenant-regression/screenshots/prod-*.png` |
| Scripts | `scripts/ui-login-semantics.mjs`, `tenant-prod-ui-routes.mjs` |

---

## 5. Next step

Deep Flow Sheet testing: click every Dashboard quick action, CRUD on Projects/Employees, validation matrices, then mark remaining cases Pass/Fail.
