# ISSUE-011 — Stock card shows raw API path text instead of material metadata

## Status: **OPEN**

## Summary
On Warehouse Stock Management (`#/stockManagement`), the stock item card for "cement" displays a truncated technical string resembling an API path / log fragment (e.g. `T] /projects?skip=0&limit=10&tenant_id=7...`) under the item name instead of a proper human-readable description or SKU.

## Steps to Reproduce
1. Login as tenant@yopmail.com / Abcd@123 on https://briktra.com/app/index.html
2. Open Stock → Warehouse Stock Management
3. Observe stock card for "cement"

## Expected Result
Card shows material name, category, units, and price only — no internal API paths or debug strings

## Actual Result
Debug/API path fragment rendered under "cement" name; low-stock warning triangle also shown

## Severity
Medium

## Priority
P2

## Screenshots Required
Yes — `docs/qa-tenant-regression/screenshots/prod-Stock.png`

## Possible Root Cause
Wrong field bound in stock list item widget; debug log accidentally rendered as Text; string interpolation of request URL into subtitle

## Acceptance Criteria
- No API URLs or log fragments visible on stock cards
- Subtitle shows intended business fields only

**Flow Sheet:** Warehouse Stock Management → Stock item card
**Module:** Inventory / Stock
**API:** prod
**Detected:** 2026-08-10
