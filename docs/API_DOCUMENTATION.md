# Finance Tracker - API Documentation

Complete API reference for the Finance Tracker backend.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Organizations](#organizations)
4. [Transactions](#transactions)
5. [Recurring Transactions](#recurring-transactions)
6. [Budgets](#budgets)
7. [Team Management](#team-management)
8. [Invitations](#invitations)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

---

## Overview

**Base URL**: `http://localhost:3001` (development) or your production URL

**Content Type**: `application/json`

**Authentication**: Bearer token (Clerk JWT)

All API requests require authentication via Clerk JWT token in the Authorization header.

---

## Authentication

### Headers

All authenticated requests must include:

```http
Authorization: Bearer <clerk_jwt_token>
Content-Type: application/json
```

### Getting a Token

Use Clerk's `getToken()` method in your frontend:

```javascript
import { useAuth } from '@clerk/clerk-react';

const { getToken } = useAuth();
const token = await getToken();
```

### Token Validation

The backend validates tokens using Clerk's API and extracts the user ID for authorization.

---

## Organizations

### Get User's Organization

Retrieve the organization for the authenticated user.

**Endpoint**: `GET /api/organizations/me`

**Response**:
```json
{
  "organization": {
    "id": "uuid",
    "name": "Personal Finances",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `404`: Organization not found

---

### Create Organization

Create a new organization for the authenticated user.

**Endpoint**: `POST /api/organizations`

**Request Body**:
```json
{
  "name": "Family Budget"
}
```

**Response**:
```json
{
  "organization": {
    "id": "uuid",
    "name": "Family Budget",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Status Codes**:
- `201`: Created
- `400`: Invalid request
- `401`: Unauthorized

---

## Transactions

### List Transactions

Get all transactions for an organization.

**Endpoint**: `GET /api/transactions?organizationId={id}`

**Query Parameters**:
- `organizationId` (required): Organization UUID

**Response**:
```json
{
  "transactions": [
    {
      "id": "uuid",
      "organization_id": "uuid",
      "description": "Grocery shopping",
      "amount": 125.50,
      "currency": "USD",
      "type": "expense",
      "category": "food",
      "date": "2024-01-15",
      "created_by": "clerk_user_id",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden (not a member)

---

### Create Transaction

Add a new transaction.

**Endpoint**: `POST /api/transactions`

**Request Body**:
```json
{
  "organizationId": "uuid",
  "description": "Monthly salary",
  "amount": 5000.00,
  "currency": "USD",
  "type": "income",
  "category": "salary",
  "date": "2024-01-31"
}
```

**Response**:
```json
{
  "transaction": {
    "id": "uuid",
    "organization_id": "uuid",
    "description": "Monthly salary",
    "amount": 5000.00,
    "currency": "USD",
    "type": "income",
    "category": "salary",
    "date": "2024-01-31",
    "created_by": "clerk_user_id",
    "created_at": "2024-01-31T12:00:00Z",
    "updated_at": "2024-01-31T12:00:00Z"
  }
}
```

**Validation**:
- `description`: Required, min 1 character
- `amount`: Required, positive number
- `type`: Required, must be "income" or "expense"
- `category`: Required
- `date`: Required, ISO date format

**Status Codes**:
- `201`: Created
- `400`: Invalid request
- `401`: Unauthorized
- `403`: Forbidden (not a member)

---

### Update Transaction

Update an existing transaction.

**Endpoint**: `PUT /api/transactions/:id`

**Request Body**:
```json
{
  "description": "Updated description",
  "amount": 150.00,
  "category": "entertainment"
}
```

**Response**:
```json
{
  "transaction": {
    "id": "uuid",
    "description": "Updated description",
    "amount": 150.00,
    "category": "entertainment",
    "updated_at": "2024-01-15T14:30:00Z"
  }
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found

---

### Delete Transaction

Delete a transaction.

**Endpoint**: `DELETE /api/transactions/:id`

**Response**:
```json
{
  "message": "Transaction deleted successfully"
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found

---

### Delete All Transactions

Delete all transactions for an organization.

**Endpoint**: `DELETE /api/transactions?organizationId={id}`

**Query Parameters**:
- `organizationId` (required): Organization UUID

**Response**:
```json
{
  "message": "All transactions deleted",
  "count": 42
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden (requires admin role)

---

## Recurring Transactions

### List Recurring Transactions

Get all recurring transactions for an organization.

**Endpoint**: `GET /api/recurring-transactions?organizationId={id}`

**Response**:
```json
{
  "recurringTransactions": [
    {
      "id": "uuid",
      "organization_id": "uuid",
      "description": "Monthly rent",
      "amount": 1500.00,
      "currency": "USD",
      "type": "expense",
      "category": "housing",
      "frequency": "monthly",
      "interval": 1,
      "start_date": "2024-01-01",
      "end_date": null,
      "next_execution_date": "2024-02-01",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden

---

### Create Recurring Transaction

Create a new recurring transaction.

**Endpoint**: `POST /api/recurring-transactions`

**Request Body**:
```json
{
  "organizationId": "uuid",
  "description": "Weekly groceries",
  "amount": 100.00,
  "currency": "USD",
  "type": "expense",
  "category": "food",
  "frequency": "weekly",
  "interval": 1,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

**Frequency Options**:
- `daily`: Every X days
- `weekly`: Every X weeks
- `monthly`: Every X months
- `yearly`: Every X years

**Response**:
```json
{
  "recurringTransaction": {
    "id": "uuid",
    "next_execution_date": "2024-01-08",
    "is_active": true
  }
}
```

**Status Codes**:
- `201`: Created
- `400`: Invalid request
- `401`: Unauthorized
- `403`: Forbidden

---

### Update Recurring Transaction

Update a recurring transaction.

**Endpoint**: `PUT /api/recurring-transactions/:id`

**Request Body**:
```json
{
  "amount": 120.00,
  "interval": 2
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found

---

### Toggle Recurring Transaction

Activate or deactivate a recurring transaction.

**Endpoint**: `POST /api/recurring-transactions/:id/toggle`

**Response**:
```json
{
  "recurringTransaction": {
    "id": "uuid",
    "is_active": false
  }
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found

---

### Delete Recurring Transaction

Delete a recurring transaction.

**Endpoint**: `DELETE /api/recurring-transactions/:id`

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found

---

## Budgets

### List Budgets

Get all budgets for an organization.

**Endpoint**: `GET /api/budgets?organizationId={id}`

**Response**:
```json
{
  "budgets": [
    {
      "id": "uuid",
      "organization_id": "uuid",
      "category": "food",
      "amount": 500.00,
      "currency": "USD",
      "period": "monthly",
      "start_date": "2024-01-01",
      "end_date": null,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden

---

### Get Budget Status

Get budget with spending comparison.

**Endpoint**: `GET /api/budgets/:id/status`

**Response**:
```json
{
  "budget": {
    "id": "uuid",
    "category": "food",
    "amount": 500.00,
    "currency": "USD",
    "period": "monthly"
  },
  "spending": {
    "total": 425.50,
    "percentage": 85.1,
    "remaining": 74.50,
    "status": "warning"
  },
  "transactions": [
    {
      "id": "uuid",
      "description": "Groceries",
      "amount": 125.50,
      "date": "2024-01-15"
    }
  ]
}
```

**Status Values**:
- `ok`: Under 80%
- `warning`: 80-99%
- `exceeded`: 100%+

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found

---

### Create Budget

Create a new budget.

**Endpoint**: `POST /api/budgets`

**Request Body**:
```json
{
  "organizationId": "uuid",
  "category": "entertainment",
  "amount": 200.00,
  "currency": "USD",
  "period": "monthly",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

**Period Options**:
- `monthly`: Monthly budget
- `yearly`: Yearly budget

**Status Codes**:
- `201`: Created
- `400`: Invalid request
- `401`: Unauthorized
- `403`: Forbidden

---

### Update Budget

Update a budget.

**Endpoint**: `PUT /api/budgets/:id`

**Request Body**:
```json
{
  "amount": 250.00,
  "end_date": "2024-06-30"
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found

---

### Delete Budget

Delete a budget.

**Endpoint**: `DELETE /api/budgets/:id`

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found

---

## Team Management

### List Members

Get all members of an organization.

**Endpoint**: `GET /api/members?organizationId={id}`

**Response**:
```json
{
  "members": [
    {
      "id": "uuid",
      "user_id": "clerk_user_id",
      "organization_id": "uuid",
      "role": "owner",
      "joined_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Roles**:
- `owner`: Full access, can manage members
- `admin`: Can manage transactions and budgets
- `member`: Can view and add transactions

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden

---

### Update Member Role

Change a member's role.

**Endpoint**: `PUT /api/members/:id`

**Request Body**:
```json
{
  "role": "admin"
}
```

**Response**:
```json
{
  "member": {
    "id": "uuid",
    "role": "admin",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

**Authorization**: Requires owner role

**Status Codes**:
- `200`: Success
- `400`: Invalid role
- `401`: Unauthorized
- `403`: Forbidden (not owner)
- `404`: Not found

---

### Remove Member

Remove a member from the organization.

**Endpoint**: `DELETE /api/members/:id`

**Authorization**: Requires owner role

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden (not owner)
- `404`: Not found

---

## Invitations

### List Invitations

Get pending invitations for an organization.

**Endpoint**: `GET /api/invitations?organizationId={id}`

**Response**:
```json
{
  "invitations": [
    {
      "id": "uuid",
      "organization_id": "uuid",
      "email": "user@example.com",
      "role": "member",
      "token": "secure_token",
      "status": "pending",
      "invited_by": "clerk_user_id",
      "created_at": "2024-01-15T10:00:00Z",
      "expires_at": "2024-01-22T10:00:00Z"
    }
  ]
}
```

**Status Values**:
- `pending`: Not yet accepted
- `accepted`: User joined
- `expired`: Token expired

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden

---

### Create Invitation

Invite a user to join the organization.

**Endpoint**: `POST /api/invitations`

**Request Body**:
```json
{
  "organizationId": "uuid",
  "email": "newuser@example.com",
  "role": "member"
}
```

**Response**:
```json
{
  "invitation": {
    "id": "uuid",
    "email": "newuser@example.com",
    "token": "secure_token",
    "expires_at": "2024-01-22T10:00:00Z"
  }
}
```

**Side Effects**:
- Sends invitation email via Resend
- Token expires in 7 days

**Authorization**: Requires admin or owner role

**Status Codes**:
- `201`: Created
- `400`: Invalid request
- `401`: Unauthorized
- `403`: Forbidden

---

### Accept Invitation

Accept an invitation and join the organization.

**Endpoint**: `POST /api/invitations/:token/accept`

**Response**:
```json
{
  "message": "Invitation accepted",
  "organization": {
    "id": "uuid",
    "name": "Family Budget"
  }
}
```

**Side Effects**:
- Adds user to organization_members
- Marks invitation as accepted

**Status Codes**:
- `200`: Success
- `400`: Invalid or expired token
- `401`: Unauthorized
- `404`: Invitation not found

---

### Revoke Invitation

Cancel a pending invitation.

**Endpoint**: `DELETE /api/invitations/:id`

**Authorization**: Requires admin or owner role

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found

---

## Error Handling

### Error Response Format

All errors return a consistent format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

**400 Bad Request**
- Invalid request body
- Missing required fields
- Validation errors

**401 Unauthorized**
- Missing or invalid JWT token
- Token expired

**403 Forbidden**
- Insufficient permissions
- Not a member of organization

**404 Not Found**
- Resource doesn't exist
- Invalid ID

**500 Internal Server Error**
- Database errors
- Unexpected server errors

### Example Error Responses

**Validation Error**:
```json
{
  "error": "Amount must be a positive number"
}
```

**Authorization Error**:
```json
{
  "error": "You must be an owner to perform this action"
}
```

**Not Found Error**:
```json
{
  "error": "Transaction not found"
}
```

---

## Rate Limiting

Currently, there are no rate limits enforced. This may change in production.

**Recommended Limits** (for future implementation):
- 100 requests per minute per user
- 1000 requests per hour per organization

---

## Best Practices

### Caching

The frontend implements caching for:
- Organization data (5 min TTL)
- Automatic cache invalidation on mutations

### Pagination

Currently, all endpoints return full result sets. For large datasets, consider implementing pagination:

```
GET /api/transactions?organizationId={id}&page=1&limit=50
```

### Filtering

Use query parameters for filtering:

```
GET /api/transactions?organizationId={id}&type=expense&category=food
```

### Batch Operations

For bulk operations, consider batching requests:

```javascript
const promises = transactions.map(t => 
  createTransaction(organizationId, userId, t, getToken)
);
await Promise.all(promises);
```

---

## Webhooks (Future)

Planned webhook support for:
- Transaction created
- Budget exceeded
- Recurring transaction processed
- Member added/removed

---

## SDK Examples

### JavaScript/TypeScript

```javascript
import { useAuth } from '@clerk/clerk-react';

async function createTransaction(data) {
  const { getToken } = useAuth();
  const token = await getToken();
  
  const response = await fetch('http://localhost:3001/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
}
```

### Python

```python
import requests

def create_transaction(token, data):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    response = requests.post(
        'http://localhost:3001/api/transactions',
        headers=headers,
        json=data
    )
    
    return response.json()
```

### cURL

```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "organizationId": "uuid",
    "description": "Test transaction",
    "amount": 100.00,
    "type": "expense",
    "category": "food",
    "date": "2024-01-15"
  }'
```

---

## Support

For API issues or questions:
- Check error messages for details
- Review this documentation
- Check server logs
- Report bugs on GitHub

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- All core endpoints implemented
- Clerk authentication
- Real-time support via Supabase

### Planned Features
- Pagination
- Advanced filtering
- Webhooks
- API versioning
- GraphQL support
