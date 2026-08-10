# ISSUE-008 — Dashboard and Projects redirect to Login

## Status: **CLOSED — FALSE POSITIVE**

## Resolution (2026-08-10)
On PROD UI after real login:

- `#/dashboard` → Dashboard **PASS**
- `#/projects` → Projects **PASS**
- `#/createProject` → Create Project **PASS**

Redirects to login occurred only when session was not established via real Flutter login.

**Not a production defect.**
