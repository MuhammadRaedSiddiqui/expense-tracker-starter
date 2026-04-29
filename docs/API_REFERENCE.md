# API Reference

This document describes the REST API endpoints for the expense tracker backend.

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Authentication

All API requests require a valid Clerk JWT token in the Authorization header:

```
Authorization: Bearer <clerk_jwt_token>
```

The backend verifies the token with Clerk and extracts the user ID for authorization.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

## Endpoints

### Authentication

#### `POST /auth/sync`
Syncs user data from Clerk to the database.

**Request Body:**
```json
{
  "clerkUserId": "user_xxx",
  "email": "user@example.com",
  "fullName": "John Doe",
  "avatarUrl": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clerkUserId": "user_xxx",
    "email": "user@example.com"
  }
}
```

---

### Organizations

#### `GET /organizations`
List all organizations the user is a member of.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Organization",
      "slug": "my-org",
      "role": "owner",
      "memberCount": 5
    }
  ]
}
```

#### `POST /organizations`
Create a new organization.

**Request Body:**
```json
{
  "name": "My Organization",
  "slug": "my-org"
}
```

#### `GET /organizations/:id`
Get organization details.

#### `PATCH /organizations/:id`
Update organization (owner only).

**Request Body:**
```json
{
  "name": "Updated Name"
}
```

#### `DELETE /organizations/:id`
Delete organization (owner only).

---

### Transactions

#### `GET /organizations/:orgId/transactions`
List transactions for an organization.

**Query Parameters:**
- `type` (optional): `income` | `expense` | `all`
- `category` (optional): Filter by category
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `search` (optional): Search in description
- `sortBy` (optional): `date` | `amount` | `description`
- `sortOrder` (optional): `asc` | `desc`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "type": "expense",
        "category": "Food",
        "amount": 45.50,
        "currency": "USD",
        "description": "Grocery shopping",
        "transactionDate": "2026-04-29",
        "createdBy": {
          "id": "uuid",
          "fullName": "John Doe"
        },
        "createdAt": "2026-04-29T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    }
  }
}
```

#### `POST /organizations/:orgId/transactions`
Create a new transaction.

**Request Body:**
```json
{
  "type": "expense",
  "category": "Food",
  "amount": 45.50,
  "currency": "USD",
  "description": "Grocery shopping",
  "transactionDate": "2026-04-29"
}
```

#### `PATCH /organizations/:orgId/transactions/:id`
Update a transaction.

#### `DELETE /organizations/:orgId/transactions/:id`
Delete a transaction.

---

### Budgets

#### `GET /organizations/:orgId/budgets`
List budgets for an organization.

**Query Parameters:**
- `month` (optional): ISO date string (first day of month)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "category": "Food",
      "amount": 500.00,
      "currency": "USD",
      "month": "2026-04-01",
      "spent": 345.50,
      "remaining": 154.50,
      "percentUsed": 69.1
    }
  ]
}
```

#### `POST /organizations/:orgId/budgets`
Create a budget (admin/owner only).

**Request Body:**
```json
{
  "category": "Food",
  "amount": 500.00,
  "currency": "USD",
  "month": "2026-04-01"
}
```

#### `PATCH /organizations/:orgId/budgets/:id`
Update a budget (admin/owner only).

#### `DELETE /organizations/:orgId/budgets/:id`
Delete a budget (admin/owner only).

---

### Recurring Transactions

#### `GET /organizations/:orgId/recurring-transactions`
List recurring transactions.

#### `POST /organizations/:orgId/recurring-transactions`
Create a recurring transaction (admin/owner only).

**Request Body:**
```json
{
  "type": "expense",
  "category": "Utilities",
  "amount": 150.00,
  "currency": "USD",
  "description": "Monthly internet bill",
  "frequency": "monthly",
  "startDate": "2026-05-01",
  "endDate": null
}
```

#### `PATCH /organizations/:orgId/recurring-transactions/:id`
Update a recurring transaction (admin/owner only).

#### `DELETE /organizations/:orgId/recurring-transactions/:id`
Delete a recurring transaction (admin/owner only).

---

### Invitations

#### `POST /organizations/:orgId/invitations`
Invite a user to the organization (admin/owner only).

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "role": "member"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newuser@example.com",
    "token": "invitation_token",
    "expiresAt": "2026-05-06T10:30:00Z"
  }
}
```

#### `POST /invitations/:token/accept`
Accept an invitation.

**Response:**
```json
{
  "success": true,
  "data": {
    "organizationId": "uuid",
    "role": "member"
  }
}
```

#### `DELETE /organizations/:orgId/invitations/:id`
Cancel an invitation (admin/owner only).

---

### Members

#### `GET /organizations/:orgId/members`
List organization members.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "fullName": "John Doe",
        "email": "john@example.com",
        "avatarUrl": "https://..."
      },
      "role": "owner",
      "joinedAt": "2026-01-15T10:30:00Z"
    }
  ]
}
```

#### `PATCH /organizations/:orgId/members/:memberId`
Update member role (owner only).

**Request Body:**
```json
{
  "role": "admin"
}
```

#### `DELETE /organizations/:orgId/members/:memberId`
Remove member from organization (admin/owner only).

---

### Notifications

#### `GET /notifications`
List user notifications.

**Query Parameters:**
- `unreadOnly` (optional): `true` | `false`

#### `PATCH /notifications/:id/read`
Mark notification as read.

#### `POST /notifications/mark-all-read`
Mark all notifications as read.

---

### Analytics

#### `GET /organizations/:orgId/analytics/summary`
Get financial summary for a date range.

**Query Parameters:**
- `startDate`: ISO date string
- `endDate`: ISO date string

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 5000.00,
    "totalExpenses": 3500.00,
    "balance": 1500.00,
    "currency": "USD",
    "byCategory": [
      {
        "category": "Food",
        "amount": 800.00,
        "percentage": 22.86
      }
    ],
    "byMonth": [
      {
        "month": "2026-04",
        "income": 5000.00,
        "expenses": 3500.00
      }
    ]
  }
}
```

---

## Rate Limiting

- **Authenticated requests**: 100 requests per minute per user
- **Unauthenticated requests**: 20 requests per minute per IP

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Missing or invalid authentication token |
| `FORBIDDEN` | User lacks permission for this action |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Request validation failed |
| `DUPLICATE_ENTRY` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

## Webhooks

The API can send webhooks for certain events:

- `transaction.created`
- `transaction.updated`
- `transaction.deleted`
- `budget.exceeded`
- `invitation.accepted`

Configure webhook URLs in the organization settings.
