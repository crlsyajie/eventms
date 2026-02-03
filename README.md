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
- `/api/events/` - List, create, update, delete events
- `/api/registrations/` - Register for events, view registrations
- `/api/tickets/` - Manage and view tickets

---

See each app folder for models, serializers, and views.
