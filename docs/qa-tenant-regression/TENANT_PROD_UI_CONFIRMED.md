# Tenant PROD UI Validation — Abcd@123 Confirmed

**Date:** 2026-08-10  
**Account:** `tenant@yopmail.com` / `Abcd@123`  
**API (live app):** `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`  
**UI:** https://briktra.com/app/index.html  

> Canonical summary (all sections): `TENANT_REGRESSION_REPORT.md`

---

## Executive Summary

You were right — **UI login works**. Verified with Playwright against production.

| Check | Status |
|-------|--------|
| UI login → Dashboard | **PASS** |
| PROD API hashed login | **PASS** |
| Wrong password | **PASS** (401) |
| Profile / Employees / Projects with real data | **PASS** |
| 15 primary Flow Sheet routes load | **PASS** (no login redirect) |
| Prior QA-API failures | **Invalid** — wrong environment |

### Root cause of earlier “Abcd@123 fails”

Automation was calling **QA** (`bybdg06o5b.../qa`).  
Live Briktra app uses **PROD** (`b05vnm4akk.../prod`).

**ISSUE-001 → CLOSED (PASS).**

### Account identity (prod)

- Name: **Test Tenant Admin**
- Role: **tenant_admin**
- Tenant: **TenantAdmin Builders**
- Tier: **PREMIUM** (active, ~22 days)

---

## UI route results (Flow Sheet mapping)

| Flow Sheet page | Route | Status | Notes |
|-----------------|-------|--------|-------|
| Dashboard | `/dashboard` | **PASS** | Role tasks + Quick Actions + 1 project |
| Project List | `/projects` | **PASS** | Project “Briktra” ACTIVE |
| Create Project | `/createProject` | **PASS** | Form + map loads |
| Employees List | `/employees` | **PASS** | 4 employees listed |
| Suppliers List | `/suppliers` | **PASS** | Empty state + Create CTA |
| Contractors List | `/contractors` | **PASS** | Empty state + filters |
| Bills Management | `/billsList` | **PASS** | Empty state (not locked) |
| Document Wallet | `/documentWallet` | **PASS** | Empty company docs |
| Project Reports | `/reportsDashboard` | **PASS** | Select project empty state |
| Warehouse Stock | `/stockManagement` | **PASS*** | Data loads; *see ISSUE-011 |
| Payroll Management | `/payrollList` | **PASS** | Empty + Calculate CTA |
| Attendance | `/addAttendance` | **PASS** | Empty overview (not locked) |
| Profile | `/profile` | **PASS** | Name/email/phone/PREMIUM |
| Subscription Plans | `/plans` | **PASS** | PREMIUM Plan Active |
| Company Details | `/company-details` | **PASS** | Complete Company Profile |

Screenshots: `docs/qa-tenant-regression/screenshots/prod-*.png`

---

## Bug Summary (current)

| ID | Status | Notes |
|----|--------|-------|
| ISSUE-001 | **CLOSED** | Wrong API env |
| ISSUE-002 / ISSUE-010 | **OPEN** | Access JWT still valid after logout (prod confirmed) |
| ISSUE-003 | **RECLASSIFY** | Direct API needs signature; **UI still loads modules** (app signs or exempt path) — not a UI blocker |
| ISSUE-004 | **OPEN** | Language selection still not in Flow Sheet |
| ISSUE-005–008 | **CLOSED as false positives** | Caused by QA env / bad token inject, not prod UI |
| ISSUE-011 | **OPEN** | Stock card shows raw API path text |

---

## Regression Summary

**Auth:** PASS on prod UI + API for `Abcd@123`.  
**Core modules:** Landing screens PASS for Tenant.  
**Remaining:** Deep CRUD / every button click / validations / network failure / session timeout still pending (Flow Sheet 542 elements).  
**API harness:** Module GETs without signing secret still 401 — use UI for functional QA or provide signing secret.

---

## Next steps

1. Continue button-level Flow Sheet walkthrough from Dashboard Quick Actions (Create Project, Manage Team, etc.).
2. Fix ISSUE-011 (stock subtitle leak).
3. Fix logout token revocation (ISSUE-010).
4. Add Language Selection page to Flow Sheet (ISSUE-004).

Scripts:
- `node scripts/ui-login-semantics.mjs` — proven UI login
- `node scripts/tenant-prod-ui-routes.mjs` — route screenshots
- `node scripts/tenant-prod-regression.mjs` — API + UI (use PROD base)
