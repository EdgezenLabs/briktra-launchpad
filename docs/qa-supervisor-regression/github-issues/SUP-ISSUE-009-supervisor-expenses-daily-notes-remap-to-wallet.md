# Supervisor deep links for Expenses / Daily Notes remapped to Document Wallet

## Summary
Navigating to `#/expenses`, `#/dailyNotes`, or `#/dailyUpdates` as supervisor lands on `#/documentWallet` instead of the Flow Sheet destinations. Site scenario steps Create Expense and Submit Daily Progress cannot be reached via these hashes.

## Steps to Reproduce
1. Login as supervisior.briktra@yopmail.com / Supervisior@123
2. Open `#/expenses` (or `#/dailyNotes`, `#/dailyUpdates`)
3. Observe URL and UI

## Expected Result
Expenses module / Daily Notes / Daily Updates per Flow Sheet

## Actual Result
Document Wallet (Company tab, empty state)

## Severity
High

## Priority
P1

## Screenshots Required
Yes — `sup-route-Expenses.png`, `sup-route-Daily-Notes.png`

## Possible Root Cause
Routes unregistered for web; fallthrough to wallet; or supervisor feature flags remapping incorrectly

## Acceptance Criteria
- Correct screens open for expenses and daily progress
- Or Flow Sheet updated with actual supervisor routes (e.g. Quick Expense modal)

**Flow Sheet:** Expenses(Project Scope), Daily Notes, Daily Updates  
**Module:** Expenses / Daily Progress  
**Role:** supervisor
