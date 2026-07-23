# Role Exploration: Tenant
Email: tenant@yopmail.com
Timestamp: 2026-07-23T18:37:27.656Z
API: https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa

## Incorrect password
Status: 401
```json
{"message":"Invalid credentials"}
```

### Attempt payload keys: username, password
Status: 401
```json
{"message":"Invalid credentials"}
```

### Attempt payload keys: email, password
Status: 400
```json
{"message":"Email/Phone number and password are required"}
```

### Attempt payload keys: email_or_phone, password
Status: 400
```json
{"message":"Email/Phone number and password are required"}
```

### Attempt payload keys: phone, password
Status: 400
```json
{"message":"Email/Phone number and password are required"}
```

## Login (final)
Status: 401
```json
{"message":"Invalid credentials"}
```
