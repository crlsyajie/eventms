# API Documentation

Base URL: `http://localhost:8000/api`

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Events](#events)
- [Registrations](#registrations)
- [Tickets](#tickets)

---

## Authentication

Currently, the API uses a simplified authentication mechanism. In production, this should be replaced with proper token-based authentication (JWT/Session).

---

## Users

### Register a New User
```
POST /api/users/register/
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "is_admin": "boolean (optional, default: false)",
  "is_client": "boolean (optional, default: false)"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "is_admin": false,
  "is_client": true,
  "is_staff": false,
  "is_active": true,
  "date_joined": "2026-02-05T10:30:00Z"
}
```

---

### Login
```
POST /api/users/login/
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "is_admin": false,
    "is_client": true
  },
  "message": "Login successful"
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "error": "Invalid credentials"
}
```

---

### Get All Users
```
GET /api/users/
```

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "is_admin": false,
      "is_client": true
    }
  ]
}
```

---

### Get User Profile
```
GET /api/users/profile/
```

**Headers:**
```
Authorization: Required (IsAuthenticated)
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "is_admin": false,
  "is_client": true,
  "is_staff": false,
  "is_active": true,
  "date_joined": "2026-02-05T10:30:00Z"
}
```

---

### Update User Profile
```
PUT /api/users/profile/
```

**Headers:**
```
Authorization: Required (IsAuthenticated)
```

**Request Body:** (all fields optional)
```json
{
  "username": "string",
  "email": "string",
  "current_username": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "john_updated",
  "email": "john.updated@example.com",
  "is_admin": false,
  "is_client": true
}
```

**Error Response:** `400 Bad Request`
```json
{
  "username": ["This username is already taken."]
}
```

---

### Update User by ID
```
PUT /api/users/<user_id>/update/
```

**Request Body:**
```json
{
  "username": "string (optional)",
  "email": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "updated_username",
  "email": "updated@example.com",
  "is_admin": false,
  "is_client": true
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": "User not found"
}
```

---

## Events

### List All Events
```
GET /api/events/
```

**Query Parameters:**
- `user_id`: Filter events by submitter (integer, optional)
- `admin`: Show all events regardless of status (string, optional)

**Visibility Rules:**
- **Admins**: See all events
- **Clients**: See approved events + their own submitted events
- **Non-authenticated**: See only approved events

**Response:** `200 OK`
```json
{
  "events": [
    {
      "id": 1,
      "title": "Tech Conference 2026",
      "description": "Annual technology conference",
      "date": "2026-03-15T09:00:00Z",
      "location": "Convention Center",
      "is_paid": true,
      "price": "99.99",
      "status": "approved",
      "submitted_by": 2
    }
  ]
}
```

---

### Create New Event
```
POST /api/events/
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string (optional)",
  "date": "datetime (ISO 8601)",
  "location": "string",
  "is_paid": "boolean (optional, default: false)",
  "price": "decimal (optional, default: 0.00)",
  "submitted_by": "integer (optional)"
}
```

**Auto-Status Rules:**
- Admin-created events: Automatically `approved`
- Client-created events: Initially `pending`

**Response:** `201 Created`
```json
{
  "id": 1,
  "title": "Tech Conference 2026",
  "description": "Annual technology conference",
  "date": "2026-03-15T09:00:00Z",
  "location": "Convention Center",
  "is_paid": true,
  "price": "99.99",
  "status": "pending",
  "submitted_by": 2
}
```

---

### Get Event Details
```
GET /api/events/<event_id>/
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Tech Conference 2026",
  "description": "Annual technology conference",
  "date": "2026-03-15T09:00:00Z",
  "location": "Convention Center",
  "is_paid": true,
  "price": "99.99",
  "status": "approved",
  "submitted_by": 2
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": "Event not found"
}
```

---

### Update Event
```
PUT /api/events/<event_id>/
```

**Request Body:** (all fields optional)
```json
{
  "title": "string",
  "description": "string",
  "date": "datetime",
  "location": "string",
  "is_paid": "boolean",
  "price": "decimal",
  "status": "string (pending/approved/rejected)"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Updated Conference",
  "description": "Updated description",
  "date": "2026-03-15T09:00:00Z",
  "location": "New Location",
  "is_paid": true,
  "price": "149.99",
  "status": "approved",
  "submitted_by": 2
}
```

---

### Delete Event
```
DELETE /api/events/<event_id>/
```

**Response:** `204 No Content`
```json
{
  "message": "Event deleted"
}
```

---

### Approve/Reject Event (Admin Only)
```
POST /api/events/<event_id>/approve/
```

**Request Body:**
```json
{
  "action": "string (approve/reject)",
  "user_id": "integer (optional, for development)"
}
```

**Response:** `200 OK`
```json
{
  "message": "Event approved successfully."
}
```

**Error Response:** `403 Forbidden`
```json
{
  "error": "Only admins can approve events."
}
```

---

### Get My Submitted Events
```
GET /api/events/my-submissions/
```

**Query Parameters:**
- `user_id`: User ID (integer, required if not authenticated)

**Response:** `200 OK`
```json
{
  "events": [
    {
      "id": 1,
      "title": "My Event",
      "description": "Event I submitted",
      "date": "2026-03-15T09:00:00Z",
      "location": "Location",
      "is_paid": false,
      "price": "0.00",
      "status": "pending",
      "submitted_by": 2
    }
  ]
}
```

---

## Registrations

### List All Registrations
```
GET /api/registrations/
```

**Response:** `200 OK`
```json
{
  "registrations": [
    {
      "id": 1,
      "event": 1,
      "user": 2,
      "user_name": "John Doe",
      "status": "pending",
      "registered_at": "2026-02-05T10:30:00Z"
    }
  ]
}
```

---

### Create Registration
```
POST /api/registrations/
```

**Request Body:**
```json
{
  "event": "integer",
  "user": "integer (optional)",
  "user_name": "string"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "event": 1,
  "user": 2,
  "user_name": "John Doe",
  "status": "pending",
  "registered_at": "2026-02-05T10:30:00Z"
}
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "You are already registered for this event"
}
```

---

### Get Registration Details
```
GET /api/registrations/<registration_id>/
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "event": 1,
  "user": 2,
  "user_name": "John Doe",
  "status": "pending",
  "registered_at": "2026-02-05T10:30:00Z"
}
```

---

### Update Registration
```
PUT /api/registrations/<registration_id>/
```

**Request Body:** (all fields optional)
```json
{
  "user_name": "string",
  "status": "string"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "event": 1,
  "user": 2,
  "user_name": "Updated Name",
  "status": "approved",
  "registered_at": "2026-02-05T10:30:00Z"
}
```

---

### Delete Registration (Cancel)
```
DELETE /api/registrations/<registration_id>/
```

**Response:** `204 No Content`
```json
{
  "message": "Registration cancelled"
}
```

---

## Tickets

### List All Tickets
```
GET /api/tickets/
```

**Query Parameters:**
- `search`: Search by event title or location (string, optional)

**Response:** `200 OK`
```json
{
  "tickets": [
    {
      "id": 1,
      "event": 1,
      "registration": 1,
      "seat": "A-12",
      "issued_at": "2026-02-05T10:30:00Z",
      "ticket_number": "TKT-0001-0001-A1B2C3D4"
    }
  ]
}
```

---

### Create Ticket
```
POST /api/tickets/
```

**Request Body:**
```json
{
  "event": "integer",
  "registration": "integer",
  "seat": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "event": 1,
  "registration": 1,
  "seat": "A-12",
  "issued_at": "2026-02-05T10:30:00Z",
  "ticket_number": "TKT-0001-0001-A1B2C3D4"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Resource deleted successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

Or for validation errors:

```json
{
  "field_name": ["Error message for this field"]
}
```

---

## Notes

1. **Authentication**: Current implementation uses a simplified authentication mechanism. For production, implement JWT or Session-based authentication.

2. **Permissions**: Some endpoints check for admin/client roles. Ensure proper role assignment during user registration.

3. **Ticket Numbers**: Generated automatically using the format `TKT-{event_id:04d}-{registration_id:04d}-{hash}` where hash is an 8-character SHA256 hash for fraud prevention.

4. **Date Format**: All dates use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`

5. **Pagination**: Not currently implemented. Consider adding pagination for production use with large datasets.

6. **CORS**: Currently configured to allow all origins. Restrict this in production.
