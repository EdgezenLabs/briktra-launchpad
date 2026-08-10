# ISSUE-004 — Language selection gate not documented on Login flow path

## Status: **OPEN**

## Summary
First-time / cleared-session users land on `#/languageSelection` before Login. The Briktra Complete Flow Sheet starts at Login Page and does not document the language gate or its CTA ("Change Language") as a prerequisite step.

## Steps to Reproduce
1. Open https://briktra.com/app/index.html (fresh session / cleared storage)
2. Observe route `#/languageSelection`
3. Compare with Flow Sheet Login Page entry

## Expected Result
Flow Sheet documents language selection → Login → Dashboard path; automation can reach Login without undocumented steps

## Actual Result
App shows Select Your Language screen (English / Tamil / Hindi); Flow Sheet has no Language Selection page

## Severity
Medium

## Priority
P2

## Screenshots Required
Yes — language selection screenshots under `docs/qa-tenant-regression/screenshots/`

## Possible Root Cause
Flow Sheet authored before language onboarding screen; docs not synced with app bootstrap route

## Acceptance Criteria
- Flow Sheet includes Language Selection page with English/Tamil/Hindi cards and Change Language button → Login
- Or app redirects directly to Login when language already set

**Flow Sheet:** Login Page (missing predecessor)  
**Module:** Onboarding / Authentication  
**Detected:** 2026-08-10
