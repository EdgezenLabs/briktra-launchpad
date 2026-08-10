# Tenant PROD Regression Report

**Date:** 2026-08-10  
**Account:** tenant@yopmail.com / Abcd@123  
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod  
**UI:** https://briktra.com/app/index.html  

## Executive Summary

Login **PASS** on production UI and API. Primary module routes **PASS**.  

Earlier NO-GO from QA API was invalid (wrong environment).

| Area | Result |
|------|--------|
| PROD hashed login Abcd@123 | **PASS** |
| `/auth/me` tenant_admin PREMIUM | **PASS** |
| Wrong password | **PASS** |
| UI Login → Dashboard | **PASS** (see `tenant-prod-ui-routes.mjs`) |
| 15 UI routes | **PASS** |
| Logout token revoke | **FAIL** |
| Direct module API without signature | **BLOCKED** (harness); UI loads data |

## Profile

```json
{
  "name": "Test Tenant Admin",
  "email": "tenant@yopmail.com",
  "role": "tenant_admin",
  "tier": "premium",
  "tenant_name": "TenantAdmin Builders",
  "tenant_id": "730dc006-2177-4840-8483-2c5b48bd0912"
}
```

## Auth / API results

| ID | Check | Status |
|----|-------|--------|
| AUTH-UI-API-01 | PROD login Abcd@123 | **PASS** |
| AUTH-ME-01 | /auth/me role | **PASS** |
| AUTH-BAD-01 | Wrong password | **PASS** |
| AUTH-LOGOUT-01 | Logout | **PASS** |
| AUTH-LOGOUT-02 | Token after logout | **FAIL** |
| API-* module GETs | Without signing secret | **BLOCKED** |

## UI routes

See `prod-ui-routes.json` — all 15 routes **PASS**.

## Issues

- ISSUE-010 / ISSUE-002: access JWT after logout — **OPEN**
- ISSUE-011: stock API path text — **OPEN**
- ISSUE-003: signature — harness only — **RECLASSIFIED**
- ISSUE-001: login — **CLOSED**

Canonical summary: `TENANT_REGRESSION_REPORT.md`
