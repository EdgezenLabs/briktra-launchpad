# Live Exploration: Tenant
Email: tenant@yopmail.com
Timestamp: 2026-07-24T11:54:51.383Z
API: https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa
Local app: http://localhost:4173/app/

hash_identifier: b514940f-308c-4607-a8ba-3bae114c75b8

## Incorrect password
Status: 401
```json
{"message":"Invalid credentials"}
```

## Login (hashed)
Status: 200
```json
{
  "user_id": "515e30f4-8b8e-4118-81a5-85b5cbbbb6bc",
  "session_id": "6b153d9c-2672-420b-bf61-44e5f528dd82",
  "name": "Tenant",
  "email": "tenant@yopmail.com",
  "role": "tenant_admin",
  "tenant_id": "ec5308cf-7243-4098-a02f-a5c7f0cce546",
  "tenant_name": "Tenant Builders",
  "access_token": "***REDACTED***",
  "id_token": "***REDACTED***",
  "refresh_token": "***REDACTED***",
  "token_type": "bearer",
  "access_token_expires_in": 86400,
  "refresh_token_expires_in": 2592000,
  "phone_no": "+919876543210",
  "avatar_url": null,
  "tier": "premium",
  "tier_config": {
    "type": "premium",
    "screens": [
      "dashboard",
      "projects",
      "project_create",
      "bills",
      "suppliers",
      "reports",
      "employees",
      "attendance",
      "wallet"
    ],
    "features": {
      "rbac": true,
      "pwa_web": true,
      "dark_mode": true,
      "auto_debit": false,
      "inapp_help": true,
      "email_login": true,
      "promo_codes": true,
      "add_expenses": true,
      "offline_mode": false,
      "smart_assign": true,
      "sub_projects": true,
      "add_employees": true,
      "dashboard_kpi": true,
      "email_support": true,
      "phone_support": true,
      "promo_banners": true,
      "stock_reports": true,
      "annual_billing": true,
      "employee_roles": true,
      "gps_attendance": true,
      "multi_language": true,
      "payroll_wizard": false,
      "salary_advance": true,
      "bill_management": true,
      "biometric_login": true,
      "document_wallet": true,
      "mark_attendance": true,
      "monthly_billing": true,
      "onboarding_tour": true,
      "payment_history": true,
      "purchase_orders": false,
      "receipt_capture": true,
      "stock_inventory": true,
      "white_label_pdf": false,
      "cashfree_gateway": true,
      "daily_site_notes": true,
      "expense_approval": false,
      "priority_support": true,
      "project_overview": true,
      "custom_report_pdf": true,
      "overtime_tracking": true,
      "renewal_reminders": true,
      "two_tier_password": true,
      "attendance_reports": true,
      "broadcast_messages": true,
      "payroll_pdf_export": true,
      "push_notifications": true,
      "supplier_directory": true,
      "contract_management": true,
      "financial_analytics": false,
      "payroll_calculation": true,
      "labour_cost_tracking": true,
      "project_setup_wizard": true,
      "auto_generate_payroll": false,
      "contractor_management": true,
      "project_level_reports": true,
      "supervisor_assignment": true,
      "bulk_attendance_import": true,
      "expense_categorization": true,
      "financial_pl_analytics": true,
      "profitability_analysis": false,
      "supplier_bills_linkage": true,
      "cross_project_analytics": false,
      "employee_salary_reports": true,
      "dedicated_account_manager": false,
      "project_comparison_report": false,
      "project_type_categorization": true
    },
    "max_projects": null,
    "partial_features": []
  },
  "trial_expires_at": "2026-08-02T11:19:24.986Z",
  "trial_end_date": "2026-08-02T11:19:24.986Z",
  "is_trial_expired": false,
  "days_remaining": 8,
  "wage_amount": 0,
  "wage_type": null,
  "preferred_language": "en",
  "biometric_settings": {}
}
```

## JWT claims (unverified)
```json
{
  "sub": "515e30f4-8b8e-4118-81a5-85b5cbbbb6bc",
  "tenant_id": "ec5308cf-7243-4098-a02f-a5c7f0cce546",
  "role": "tenant_admin",
  "session_id": "6b153d9c-2672-420b-bf61-44e5f528dd82",
  "iat": 1784894095,
  "exp": 1784980495
}
```

## GET /auth/me
Status: 200
```json
{
  "user_id": "515e30f4-8b8e-4118-81a5-85b5cbbbb6bc",
  "name": "Tenant",
  "email": "tenant@yopmail.com",
  "role": "tenant_admin",
  "tenant_id": "ec5308cf-7243-4098-a02f-a5c7f0cce546",
  "tenant_name": "Tenant Builders",
  "phone_no": "+919876543210",
  "avatar_url": null,
  "tier": "premium",
  "tier_config": {
    "type": "premium",
    "screens": [
      "dashboard",
      "projects",
      "project_create",
      "bills",
      "suppliers",
      "reports",
      "employees",
      "attendance",
      "wallet"
    ],
    "features": {
      "rbac": true,
      "pwa_web": true,
      "dark_mode": true,
      "auto_debit": false,
      "inapp_help": true,
      "email_login": true,
      "promo_codes": true,
      "add_expenses": true,
      "offline_mode": false,
      "smart_assign": true,
      "sub_projects": true,
      "add_employees": true,
      "dashboard_kpi": true,
      "email_support": true,
      "phone_support": true,
      "promo_banners": true,
      "stock_reports": true,
      "annual_billing": true,
      "employee_roles": true,
      "gps_attendance": true,
      "multi_language": true,
      "payroll_wizard": false,
      "salary_advance": true,
      "bill_management": true,
      "biometric_login": true,
      "document_wallet": true,
      "mark_attendance": true,
      "monthly_billing": true,
      "onboarding_tour": true,
      "payment_history": true,
      "purchase_orders": false,
      "receipt_capture": true,
      "stock_inventory": true,
      "white_label_pdf": false,
      "cashfree_gateway": true,
      "daily_site_notes": true,
      "expense_approval": false,
      "priority_support": true,
      "project_overview": true,
      "custom_report_pdf": true,
      "overtime_tracking": true,
      "renewal_reminders": true,
      "two_tier_password": true,
      "attendance_reports": true,
      "broadcast_messages": true,
      "payroll_pdf_export": true,
      "push_notifications": true,
      "supplier_directory": true,
      "contract_management": true,
      "financial_analytics": false,
      "payroll_calculation": true,
      "labour_cost_tracking": true,
      "project_setup_wizard": true,
      "auto_generate_payroll": false,
      "contractor_management": true,
      "project_level_reports": true,
      "supervisor_assignment": true,
      "bulk_attendance_import": true,
      "expense_categorization": true,
      "financial_pl_analytics": true,
      "profitability_analysis": false,
      "supplier_bills_linkage": true,
      "cross_project_analytics": false,
      "employee_salary_reports": true,
      "dedicated_account_manager": false,
      "project_comparison_report": false,
      "project_type_categorization": true
    },
    "max_projects": null,
    "partial_features": []
  },
  "trial_expires_at": "2026-08-02T11:19:24.986Z",
  "trial_end_date": "2026-08-02T11:19:24.986Z",
  "is_trial_expired": false,
  "days_remaining": 8,
  "wage_amount": 0,
  "wage_type": null,
  "preferred_language": "en",
  "biometric_settings": {}
}
```

Detected tenant_id: ec5308cf-7243-4098-a02f-a5c7f0cce546
Detected user_id: 515e30f4-8b8e-4118-81a5-85b5cbbbb6bc
Detected role: tenant_admin

## Endpoint probe matrix
| Method | Path | Status | Body preview |
|--------|------|--------|--------------|
| GET | `/projects` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/users` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/employees` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/tenants` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/suppliers` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/contractors` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/notifications` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/users/profile` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/tenants/my-referral-code` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/bills` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/expenses` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/attendance` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/payroll` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/stock` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/subscriptions` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/plans` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/tenants/ec5308cf-7243-4098-a02f-a5c7f0cce546` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/tenants/ec5308cf-7243-4098-a02f-a5c7f0cce546/project-settings` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/users/515e30f4-8b8e-4118-81a5-85b5cbbbb6bc` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/users/515e30f4-8b8e-4118-81a5-85b5cbbbb6bc/wages` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |

## Privilege / negative probes
| Method | Path | Status | Preview |
|--------|------|--------|---------|
| GET | `/superAdmin` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/tenantAdmins` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| POST | `/users/bulk` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| GET | `/tenants/00000000-0000-0000-0000-000000000001` | 401 | {"error":"Missing X-Request-Signature header","detail":"Request signature is required"} |
| DELETE | `/tenants/ec5308cf-7243-4098-a02f-a5c7f0cce546` | SKIPPED | Destructive — not executed |

## POST /auth/refresh
Status: 200
```json
{
  "access_token": "***REDACTED***",
  "id_token": "***REDACTED***",
  "token_type": "bearer",
  "expires_in": 86400
}
```

## POST /auth/logout
Status: 200
```json
{
  "message": "Logged out successfully"
}
```

## Post-logout GET /auth/me
Status: 200
```json
{
  "user_id": "515e30f4-8b8e-4118-81a5-85b5cbbbb6bc",
  "name": "Tenant",
  "email": "tenant@yopmail.com",
  "role": "tenant_admin",
  "tenant_id": "ec5308cf-7243-4098-a02f-a5c7f0cce546",
  "tenant_name": "Tenant Builders",
  "phone_no": "+919876543210",
  "avatar_url": null,
  "tier": "premium",
  "tier_config": {
    "type": "premium",
    "screens": [
      "dashboard",
      "projects",
      "project_create",
      "bills",
      "suppliers",
      "reports",
      "employees",
      "attendance",
      "wallet"
    ],
    "features": {
      "rbac": true,
      "pwa_web": true,
      "dark_mode": true,
      "auto_debit": false,
      "inapp_help": true,
      "email_login": true,
      "promo_codes": true,
      "add_expenses": true,
      "offline_mode": false,
      "smart_assign": true,
      "sub_projects": true,
      "add_employees": true,
      "dashboard_kpi": true,
      "email_support": true,
      "phone_support": true,
      "promo_banners": true,
      "stock_reports": true,
      "annual_billing": true,
      "employee_roles": true,
      "gps_attendance": true,
      "multi_language": true,
      "payroll_wizard": false,
      "salary_advance": true,
      "bill_management": true,
      "biometric_login": true,
      "document_wallet": true,
      "mark_attendance": true,
      "monthly_billing": true,
      "onboarding_tour": true,
      "payment_history": true,
      "purchase_orders": false,
      "receipt_capture": true,
      "stock_inventory": true,
      "white_label_pdf": false,
      "cashfree_gateway": true,
      "daily_site_notes": true,
      "expense_approval": false,
      "priority_support": true,
      "project_overview": true,
      "custom_report_pdf": true,
      "overtime_tracking": true,
      "renewal_reminders": true,
      "two_tier_password": true,
      "attendance_reports": true,
      "broadcast_messages": true,
      "payroll_pdf_export": true,
      "push_notifications": true,
      "supplier_directory": true,
      "contract_management": true,
      "financial_analytics": false,
      "payroll_calculation": true,
      "labour_cost_tracking": true,
      "project_setup_wizard": true,
      "auto_generate_payroll": false,
      "contractor_management": true,
      "project_level_reports": true,
      "supervisor_assignment": true,
      "bulk_attendance_import": true,
      "expense_categorization": true,
      "financial_pl_analytics": true,
      "profitability_analysis": false,
      "supplier_bills_linkage": true,
      "cross_project_analytics": false,
      "employee_salary_reports": true,
      "dedicated_account_manager": false,
      "project_comparison_report": false,
      "project_type_categorization": true
    },
    "max_projects": null,
    "partial_features": []
  },
  "trial_expires_at": "2026-08-02T11:19:24.986Z",
  "trial_end_date": "2026-08-02T11:19:24.986Z",
  "is_trial_expired": false,
  "days_remaining": 8,
  "wage_amount": 0,
  "wage_type": null,
  "preferred_language": "en",
  "biometric_settings": {}
}
```