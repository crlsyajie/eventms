# EventMS (project)

This repo contains a sample project structure for EventMS.

## Files and folders created
- docs/ — documentation and design artifacts
- backend/ — backend source (placeholder)
- frontend/ — frontend source (placeholder)

## Docs included
- requirements.md
- system-design.md
- test-cases.md
- deployment.md
- future-enhancements.md
- **API.md** - Complete API endpoint documentation

See `structure.md` for a quick layout overview.
------------------

# Frontend (EventMS)

This folder contains a minimal React + Vite scaffold.

To run locally:

```bash
cd frontend
npm install
npm run dev
```

Files of interest:
- `src/api/axios.js` — axios instance
- `src/components` — UI components
- `src/pages` — page views
- `src/services` — API wrappers


-------------------
# Backend - Event Management System

This folder contains the Django REST API backend for the Event Management System.

## Structure
- Django project: `eventms_backend`
- Apps:
  - `events`: Event listing and management
  - `registrations`: User registrations for events
  - `tickets`: Ticket management

## Setup
1. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers
   ```
3. Start the Django project:
   ```bash
   django-admin startproject eventms_backend .
   ```
4. Create the apps:
   ```bash
   python manage.py startapp events
   python manage.py startapp registrations
   python manage.py startapp tickets
   ```
5. Add the apps and required packages to `INSTALLED_APPS` in `eventms_backend/settings.py`:
   - `rest_framework`
   - `corsheaders`
   - `events`
   - `registrations`
   - `tickets`
6. Configure CORS in `settings.py`:
   ```python
   CORS_ALLOW_ALL_ORIGINS = True
   ```
7. Run migrations:
   ```bash
   python manage.py migrate
   ```
8. Run the server:
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Users
- `POST /api/users/register/` - Register a new user
- `POST /api/users/login/` - User login
- `GET /api/users/` - List all users
- `GET /api/users/profile/` - Get user profile (authenticated)
- `PUT /api/users/profile/` - Update user profile (authenticated)
- `PUT /api/users/<user_id>/update/` - Update user by ID

### Events
- `GET /api/events/` - List events (filtered by role/status)
- `POST /api/events/` - Create new event
- `GET /api/events/<event_id>/` - Get event details
- `PUT /api/events/<event_id>/` - Update event
- `DELETE /api/events/<event_id>/` - Delete event
- `POST /api/events/<event_id>/approve/` - Approve/reject event (admin only)
- `GET /api/events/my-submissions/` - Get user's submitted events

### Registrations
- `GET /api/registrations/` - List all registrations
- `POST /api/registrations/` - Create registration
- `GET /api/registrations/<registration_id>/` - Get registration details
- `PUT /api/registrations/<registration_id>/` - Update registration
- `DELETE /api/registrations/<registration_id>/` - Cancel registration

### Tickets
- `GET /api/tickets/` - List all tickets (supports search)
- `POST /api/tickets/` - Create ticket

**📘 For complete API documentation with request/response examples, see [docs/API.md](docs/API.md)**

---

See each app folder for models, serializers, and views.

---
Best Website Experience
Laptop:1440px,1024px
Tablet: 768px

