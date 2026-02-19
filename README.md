# EventMS - Event Management System

EventMS is a comprehensive Event Management System designed to facilitate the creation, management, and registration of events. It features a robust backend for handling data and logic, and a modern frontend for a seamless user experience.

## Technologies Used

### Backend
- **Framework**: Django 4.2
- **API**: Django REST Framework (DRF) 3.15.2
- **CORS**: django-cors-headers 4.3.0
- **Database**: SQLite (default, configurable)

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Charts**: Chart.js, React Chartjs 2

## Project Structure

The repository is organized into the following main directories:

- `backend/`: Contains the Django project source code.
    - `eventms_backend/`: Project settings and configuration.
    - `events/`: App for event listing and management.
    - `registrations/`: App for user registrations.
    - `tickets/`: App for ticket management.
    - `users/`: App for user authentication and profiles.
- `frontend/`: Contains the React frontend source code.
    - `src/`: Source files including components, pages, and services.
- `docs/`: Documentation files (API, system design, etc.).

## Manual Setup

Follow these instructions to set up the project locally.

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment:
    ```bash
    python3 -m venv venv
    ```

3.  Activate the virtual environment:
    - On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```
    - On Windows:
        ```bash
        venv\Scripts\activate
        ```

4.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5.  Run database migrations:
    ```bash
    python manage.py migrate
    ```

6.  Start the development server:
    ```bash
    python manage.py runserver
    ```
    The backend API will be available at `http://localhost:8000/api/`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

## API Documentation

The backend exposes a RESTful API. Below is a high-level overview of the main resources. For detailed documentation, including request/response examples, please refer to [docs/API.md](docs/API.md).

### Main Endpoints

-   **Users**
    -   `POST /api/users/register/` - Register a new user
    -   `POST /api/users/login/` - User login
    -   `GET /api/users/profile/` - Get current user profile

-   **Events**
    -   `GET /api/events/` - List events
    -   `POST /api/events/` - Create a new event
    -   `GET /api/events/<id>/` - Get event details

-   **Registrations**
    -   `POST /api/registrations/` - Register for an event
    -   `GET /api/registrations/` - List registrations

-   **Tickets**
    -   `GET /api/tickets/` - List tickets
    -   `POST /api/tickets/` - Issue a ticket

See [docs/API.md](docs/API.md) for the complete API reference.
