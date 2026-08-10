# UI Review Prompt

Compare live UI to Flow Sheet `Leads To` column and design system.

## Environment
https://briktra.com/app/index.html — login `tenant@yopmail.com` / `Abcd@123`

## Checklist per screen
- Header title matches Page name
- Primary CTA label and destination
- Empty states vs error states
- Lock/paywall screens vs tier_config (PROD tenant is PREMIUM — should not see Free Trial locks)
- Bottom/side nav: Home, Reports, Wallet, Stock, Profile
- Orange brand consistency, typography, spacing
- Mobile vs desktop (1280px) layout

## Known UI defect
- ISSUE-011: Stock card shows raw API path under material name

## Evidence
Screenshots in `docs/qa-tenant-regression/screenshots/prod-*.png`  
Report: `docs/qa-tenant-regression/TENANT_REGRESSION_REPORT.md`
