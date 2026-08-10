# Supervisor can open Company Settings

## Summary
`#/company-details` loads Complete Company Profile with editable company name (TenantAdmin Builders), GST, logo, location. Supervisor must not edit company settings.

## Steps to Reproduce
1. Login as supervisor
2. Open `#/company-details`

## Expected Result
Access denied

## Actual Result
Full company profile editor

## Severity
High

## Priority
P1

## Screenshots Required
Yes — `screenshots/sup-neg-Company-Details.png`

## Possible Root Cause
Company details not role-gated

## Acceptance Criteria
Only tenant_admin edits company settings

**Flow Sheet:** Restricted — Delete/Edit Company  
**Module:** Settings / RBAC  
**Role:** supervisor
