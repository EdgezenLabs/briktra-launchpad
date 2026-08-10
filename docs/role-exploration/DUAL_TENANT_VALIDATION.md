# Dual Tenant Live Validation (historical + pointer)

**Updated:** 2026-08-10

This file originally recorded a **QA API** dual-account probe (`tenantadmin@` + `tenant@`) that was blocked by request signing and used outdated environment assumptions.

## Current source of truth

Use:

- `docs/qa-tenant-regression/TENANT_REGRESSION_REPORT.md`
- `docs/qa-tenant-regression/TENANT_PROD_UI_CONFIRMED.md`
- `docs/role-exploration/DUAL_TENANT_TEST_CASES.md`

## PROD confirmed (live)

- Email: `tenant@yopmail.com`
- Password: `Abcd@123`
- API: `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`
- Login + primary screens: **PASS**

## Historical QA note

QA base `bybdg06o5b.../qa` accepted `Tenant@123` for some accounts; that is **not** the live app environment.
