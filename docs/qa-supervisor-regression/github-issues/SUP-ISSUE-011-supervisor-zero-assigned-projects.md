# Supervisor has zero assigned projects — site scenario blocked

## Summary
After login, Dashboard "All Projects" badge shows **0** and Projects list empty state: "No projects available… once they are created or assigned to you." Site Supervisor cannot View Assigned Project / Site Details / Daily Progress against a real site.

## Steps to Reproduce
1. Login as supervisior.briktra@yopmail.com
2. Open Dashboard and `#/projects`

## Expected Result
At least one assigned project for field testing (or documented empty-tenant test data)

## Actual Result
0 projects assigned

## Severity
High (test data / assignment)

## Priority
P1

## Screenshots Required
Yes — `sup-01-after-login.png`, `sup-route-Projects.png`

## Possible Root Cause
User not assigned to project "Briktra"; assignment missing in QA data

## Acceptance Criteria
Supervisor test account has ≥1 assigned active project for site workflows

**Flow Sheet:** Project List / Site Details  
**Module:** Projects / Test Data  
**Role:** supervisor
