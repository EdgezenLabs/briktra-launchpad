# Manager can open Company Settings (Complete Company Profile)

## Summary
Manager deep-link `#/company-details` loads **Complete Company Profile** with editable Company Name (TenantAdmin Builders), GST, logo upload, location — company settings reserved for tenant_admin.

## Steps to Reproduce
1. Login as manager
2. Open `#/company-details`

## Expected Result
Permission denied

## Actual Result
Full company profile editor with Continue to Dashboard / Skip

## Severity
High

## Priority
P1

## Screenshots Required
Yes — `screenshots/mgr-neg-Company-Details.png`

## Possible Root Cause
Company details route not role-gated

## Acceptance Criteria
Only tenant_admin can edit company settings; manager denied

**Flow Sheet:** Restricted — Company Settings  
**Module:** Settings / RBAC  
**Role:** manager  
**Detected:** 2026-08-10
