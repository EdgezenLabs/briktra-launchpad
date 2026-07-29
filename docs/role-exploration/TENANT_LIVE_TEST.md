# Tenant Role — Live Testing Session

**Date:** 24 July 2026 (updated)  
**Environment:** Live https://briktra.com/app/index.html#/login  
**API:** `https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa`  
**Account:** `tenant@yopmail.com` / `Tenant@123`  
**Rule:** Login only — no register calls  

---

## 1. Session status: LOGIN UNBLOCKED — modules blocked by request signing

### Auth identity (confirmed)

| Field | Value |
|-------|--------|
| Name | Tenant |
| Role | `tenant_admin` |
| Tenant | Tenant Builders (`ec5308cf-7243-4098-a02f-a5c7f0cce546`) |
| User ID | `515e30f4-8b8e-4118-81a5-85b5cbbbb6bc` |
| Tier | `premium` |
| Screens (tier) | dashboard, projects, project_create, bills, suppliers, reports, employees, attendance, wallet |

### Login contract (matches Flutter web client)

1. `GET /auth/login/hint?username=tenant@yopmail.com` → `hash_identifier` UUID  
2. Client hash: `PBKDF2-HMAC-SHA256(password, SHA256(utf8(hash_identifier + "briktra-password-salt-guid-2026")), 10000, 32)` → **base64**  
3. `POST /auth/login` with `{ username, password: <hashed> }` + header `X-Client-Platform: flutter`  
4. Plaintext password → **401** (expected)

Scripts: `scripts/tenant-login-hashed.mjs`, `scripts/explore-one-role.mjs`

---

## 2. Authentication & session results

| ID | Scenario | Result | Notes |
|----|----------|--------|-------|
| TEN-AUTH-01 | Valid login (hashed) | **PASS** | 200 + tokens; role `tenant_admin` |
| TEN-AUTH-02 | Wrong password (hashed wrong secret) | **PASS** | 401 Invalid credentials |
| TEN-AUTH-02b | Plaintext password | **PASS** (rejected) | 401 — client must hash |
| TEN-AUTH-03 | Refresh browser after login | **PENDING UI** | Needs browser; tokens stored in local storage by app |
| TEN-AUTH-04 | `/auth/me` | **PASS** | role = `tenant_admin`, premium tier |
| TEN-AUTH-05 | `/auth/refresh` | **PASS** | 200 new access token |
| TEN-AUTH-06 | Logout | **PASS** | `POST /auth/logout` → 200 |
| TEN-AUTH-07 | `/auth/me` after logout | **FAIL** | Still **200** with same access token — logout does **not** revoke access JWT |

Evidence: `docs/role-exploration/Tenant-login-success.md`, `Tenant-live.md`

---

## 3. Module / screen API results — BLOCKED

Every non-auth data endpoint returns:

```json
{"error":"Missing X-Request-Signature header","detail":"Request signature is required"}
```

| Path | Status |
|------|--------|
| `/projects`, `/users`, `/employees`, `/tenants`, `/suppliers`, `/contractors` | 401 |
| `/bills`, `/expenses`, `/attendance`, `/payroll`, `/stock` | 401 |
| `/notifications`, `/plans`, `/subscriptions` | 401 |
| `/tenants/{own_id}`, project-settings, `/users/{own_id}` | 401 |

### Root cause

Flutter client builds signatures only when signing secret `$.b3t` is non-empty:

- Live/local web bundle initializes `$.b3t = ""`
- Therefore web client **never sends** `X-Request-Signature` / `X-Request-Timestamp`
- QA API **requires** those headers on data routes
- Auth routes (`/auth/login`, `/auth/me`, `/auth/refresh`, `/auth/logout`, `/auth/login/hint`) work without signature

**Implication:** Even a successful browser login at https://briktra.com/app/index.html#/login likely cannot load Projects / Employees / etc. on web until the app is rebuilt with the request-signing secret (or the API relaxes web signing).

HMAC format (from client `cKY`):  
`hex(HMAC-SHA256(secret, METHOD|path|timestamp|body)).toLowerCase()`  
Headers: `X-Request-Signature`, `X-Request-Timestamp` (unix ms string)

---

## 4. Tenant test plan — remaining (needs signing secret)

Once `X-Request-Signature` can be produced (provide secret, or fix web build):

### 4.1 Dashboard & navigation (UI)

| ID | Scenario | Status |
|----|----------|--------|
| TEN-DASH-01..04 | Landing `/dashboard`, role tasks, quick actions, bottom nav | **BLOCKED** (API signing) |

### 4.2 Projects / Employees / modules

| ID | Scenario | Status |
|----|----------|--------|
| TEN-PRJ-*, TEN-EMP-*, attendance/payroll/expenses/bills/stock/wallet/reports | Live Pass/Fail | **BLOCKED** |

### 4.3 Tenant-only settings

| ID | Scenario | Status |
|----|----------|--------|
| TEN-SET-01..06 | Role login toggles, company, password, language, Cashfree | **BLOCKED** |

---

## 5. Evidence log

| Time (UTC) | Check | Outcome |
|------------|-------|---------|
| 2026-07-24 | Live site/app reachable | PASS |
| 2026-07-24 | Tenant plaintext login | FAIL 401 |
| 2026-07-24 | Discover client PBKDF2 hash + hint | Done |
| 2026-07-24 | Tenant hashed login `Tenant@123` | **PASS 200** |
| 2026-07-24 | `/auth/me` tenant_admin + premium | **PASS** |
| 2026-07-24 | Wrong password | **PASS** 401 |
| 2026-07-24 | Refresh / logout | **PASS** 200 |
| 2026-07-24 | Post-logout `/auth/me` | **FAIL** still 200 |
| 2026-07-24 | Module GETs without signature | **FAIL** 401 Missing X-Request-Signature |
| — | Full Tenant screen matrix | **BLOCKED** pending signing secret |

---

## 6. Next step (needed from you)

To continue Tenant deep-testing of Projects / Team / Reports / Wallet / etc.:

1. **Share the QA request-signing secret** used by the mobile/native Flutter build (`REQUEST_SIGNING_SECRET` / dart-define), **or**
2. Confirm whether after browser login the dashboard data actually loads on your machine (if it does, how — different build/API?), **or**
3. Temporarily disable signature requirement on QA for web, then reply “retry Tenant modules”

Until then, Tenant **login + session** are verified; **module screens** cannot be scored via API.
