# Dual Tenant Admin — Test Cases & Live Validation

**Last updated:** 2026-08-10  
**Primary PROD account:** `tenant@yopmail.com` / `Abcd@123`  
**UI:** https://briktra.com/app/index.html  
**API:** `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`  

> Earlier dual-tenant run against **QA** (`tenantadmin@` + `tenant@` with `Tenant@123`) is historical only. Live app validation uses **PROD** + `Abcd@123`.

---

## 1. Accounts

| Label | Email | Password | Env | Login | Role | Notes |
|-------|-------|----------|-----|-------|------|-------|
| **Tenant (PROD)** | tenant@yopmail.com | Abcd@123 | PROD | **PASS** | tenant_admin | Test Tenant Admin / TenantAdmin Builders / PREMIUM |
| Tenant (QA historical) | tenant@yopmail.com | Tenant@123 | QA | PASS on QA only | tenant_admin | Do not use for live UI |
| TenantAdmin (QA historical) | tenantadmin@yopmail.com | Tenant@123 | QA | PASS on QA only | tenant_admin | Separate QA tenant |

---

## 2. Validated auth cases (PROD)

| ID | Scenario | Status |
|----|----------|--------|
| TN-AUTH-01 | Valid UI + API login Abcd@123 | **PASS** |
| TN-AUTH-02 | Wrong password | **PASS** |
| TN-AUTH-03 | `/auth/me` premium tenant_admin | **PASS** |
| TN-AUTH-06 | Access after logout | **FAIL** |

---

## 3. Screen access cases (PROD UI smoke)

| ID | Scenario | Status |
|----|----------|--------|
| TC-DASH-01 | Land `/dashboard` | **PASS** |
| TC-PRJ-01 | List projects | **PASS** |
| TC-PRJ-02 | Open create project | **PASS** |
| TC-EMP-01 | Employee directory | **PASS** |
| TC-SUP-01 | Suppliers empty/list | **PASS** |
| TC-CON-01 | Contractors | **PASS** |
| TC-BILL-01 | Bills | **PASS** |
| TC-ATT-01 | Attendance | **PASS** |
| TC-PAY-01 | Payroll | **PASS** |
| TC-STK-01 | Stock | **PASS*** (ISSUE-011) |
| TC-WAL-01 | Wallet | **PASS** |
| TC-RPT-01 | Reports | **PASS** |
| TC-SET-06 | Plans | **PASS** |
| TC-NEG-04 | Post-logout `/auth/me` | **FAIL** |

Deep CRUD / filters / pagination / validations: **PENDING**

---

## 4. Verdict

| Gate | Result |
|------|--------|
| PROD Tenant login | **YES** |
| Module smoke | **YES** |
| Full Flow Sheet sign-off | **NO** — deep tests + open defects remain |

Canonical report: `docs/qa-tenant-regression/TENANT_REGRESSION_REPORT.md`
