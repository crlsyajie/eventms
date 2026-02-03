# Event Management System - Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                           EVENT MANAGEMENT SYSTEM - ERD                                      │
│                                   Database: SQLite3                                          │
└─────────────────────────────────────────────────────────────────────────────────────────────┘


                              ┌─────────────────────────────┐
                              │           USER              │
                              ├─────────────────────────────┤
                              │ PK  id           INTEGER    │
                              │     username     VARCHAR    │
                              │     email        VARCHAR    │
                              │     password     VARCHAR    │
                              │     first_name   VARCHAR    │
                              │     last_name    VARCHAR    │
                              │     is_admin     BOOLEAN    │
                              │     is_client    BOOLEAN    │
                              │     is_active    BOOLEAN    │
                              │     date_joined  DATETIME   │
                              │     last_login   DATETIME   │
                              └─────────────────────────────┘
                                    │              │
                          1:N       │              │       1:N
                    ┌───────────────┘              └───────────────┐
                    │ submitted_by (FK)                   user (FK)│
                    ▼                                              ▼
┌─────────────────────────────┐                    ┌─────────────────────────────┐
│          EVENT              │                    │       REGISTRATION          │
├─────────────────────────────┤        1:N         ├─────────────────────────────┤
│ PK  id           INTEGER    │◄───────────────────│ PK  id           INTEGER    │
│     title        VARCHAR    │     event (FK)     │ FK  event_id     INTEGER    │
│     description  TEXT       │                    │ FK  user_id      INTEGER    │
│     date         DATETIME   │                    │     user_name    VARCHAR    │
│     location     VARCHAR    │                    │     status       VARCHAR    │
│     is_paid      BOOLEAN    │                    │     registered_at DATETIME  │
│     price        DECIMAL    │                    └─────────────────────────────┘
│     status       VARCHAR    │                                │
│ FK  submitted_by INTEGER    │                                │ 1:N
└─────────────────────────────┘                                │ registration (FK)
              │                                                ▼
              │ 1:N                              ┌─────────────────────────────┐
              │ event (FK)                       │          TICKET             │
              │                                  ├─────────────────────────────┤
              └─────────────────────────────────►│ PK  id           INTEGER    │
                                                 │ FK  event_id     INTEGER    │
                                                 │ FK  registration INTEGER    │
                                                 │     seat         VARCHAR    │
                                                 │     issued_at    DATETIME   │
                                                 │     ticket_number (computed)│
                                                 └─────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════
                                    FIELD DETAILS
═══════════════════════════════════════════════════════════════════════════════════════════════

EVENT.status:           'pending' | 'approved' | 'rejected'
REGISTRATION.status:    'pending' | 'confirmed' | 'cancelled'
TICKET.ticket_number:   Format: TKT-{event_id:04d}-{registration_id:04d}-{SHA256[:8]}
                        Example: TKT-0001-0025-A3F2B1C9


═══════════════════════════════════════════════════════════════════════════════════════════════
                                    RELATIONSHIPS
═══════════════════════════════════════════════════════════════════════════════════════════════

┌────────────────────┬───────────┬──────────────────────┬──────────────────────────────────────┐
│   Entity 1         │   Type    │     Entity 2         │       Description                    │
├────────────────────┼───────────┼──────────────────────┼──────────────────────────────────────┤
│ USER               │   1 : N   │ EVENT                │ User (client) submits events         │
├────────────────────┼───────────┼──────────────────────┼──────────────────────────────────────┤
│ USER               │   1 : N   │ REGISTRATION         │ User registers for events            │
├────────────────────┼───────────┼──────────────────────┼──────────────────────────────────────┤
│ EVENT              │   1 : N   │ REGISTRATION         │ Event has multiple registrations     │
├────────────────────┼───────────┼──────────────────────┼──────────────────────────────────────┤
│ EVENT              │   1 : N   │ TICKET               │ Event has multiple tickets           │
├────────────────────┼───────────┼──────────────────────┼──────────────────────────────────────┤
│ REGISTRATION       │   1 : N   │ TICKET               │ Registration generates tickets       │
└────────────────────┴───────────┴──────────────────────┴──────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════
                                    USER ROLES
═══════════════════════════════════════════════════════════════════════════════════════════════

┌──────────────┬───────────┬────────────┬──────────────────────────────────────────────────────┐
│  ROLE        │ is_admin  │ is_client  │  PERMISSIONS                                         │
├──────────────┼───────────┼────────────┼──────────────────────────────────────────────────────┤
│  Admin       │   TRUE    │   FALSE    │  • Create events (auto-approved)                     │
│              │           │            │  • Manage all events (CRUD)                          │
│              │           │            │  • Approve/Reject client submissions                 │
│              │           │            │  • View all registrations                            │
│              │           │            │  • Access admin dashboard with analytics             │
├──────────────┼───────────┼────────────┼──────────────────────────────────────────────────────┤
│  Client      │   FALSE   │   TRUE     │  • Submit events (requires approval)                 │
│              │           │            │  • View own submissions & status                     │
│              │           │            │  • View approved events list                         │
│              │           │            │  • Access client dashboard                           │
├──────────────┼───────────┼────────────┼──────────────────────────────────────────────────────┤
│  Regular     │   FALSE   │   FALSE    │  • View approved events only                         │
│  User        │           │            │  • Register for events                               │
│              │           │            │  • View own registrations (via user_id FK)           │
│              │           │            │  • View own tickets                                  │
└──────────────┴───────────┴────────────┴──────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════
                                    DATA FLOW
═══════════════════════════════════════════════════════════════════════════════════════════════

                                EVENT CREATION FLOW
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                                                                             │
    │   Admin Creates Event ──────► status = 'approved' (auto)                    │
    │                                                                             │
    │   Client Submits Event ─────► status = 'pending' ──► Admin Reviews          │
    │                                                       │                     │
    │                                              ┌────────┴────────┐            │
    │                                              ▼                 ▼            │
    │                                         'approved'        'rejected'        │
    │                                              │                              │
    │                                              ▼                              │
    │                                    Visible to all users                     │
    │                                                                             │
    └─────────────────────────────────────────────────────────────────────────────┘

                              REGISTRATION & TICKET FLOW
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                                                                             │
    │   User views approved events ──► Registers ──► Registration created         │
    │                                                       │                     │
    │                                                       ▼                     │
    │                                              Ticket generated               │
    │                                              (unique hash number)           │
    │                                                                             │
    └─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════
                              TICKET NUMBER GENERATION (Fraud Prevention)
═══════════════════════════════════════════════════════════════════════════════════════════════

    Format:     TKT-{EVENT_ID:04d}-{REGISTRATION_ID:04d}-{SHA256_HASH[:8]}
    Example:    TKT-0001-0025-A3F2B1C9

    Generation Process:
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │  1. Combine: "EVT{event_id}-REG{registration_id}-TKT{ticket_id}"            │
    │  2. Generate SHA256 hash of the combined string                             │
    │  3. Take first 8 characters (uppercase)                                     │
    │  4. Format: TKT-0001-0025-A3F2B1C9                                          │
    └─────────────────────────────────────────────────────────────────────────────┘

    Benefits:
    ✓ Unique per ticket (hash includes ticket_id)
    ✓ Traceable to event and registration
    ✓ Difficult to forge or guess
    ✓ Human-readable format


═══════════════════════════════════════════════════════════════════════════════════════════════
                                    QUERY EXAMPLES
═══════════════════════════════════════════════════════════════════════════════════════════════

    -- Admin: View pending events for approval
    SELECT * FROM events WHERE status = 'pending';

    -- Regular User: View approved events
    SELECT * FROM events WHERE status = 'approved';

    -- User: View my registrations
    SELECT * FROM registrations WHERE user_id = {current_user_id};

    -- User: View my tickets
    SELECT t.* FROM tickets t
    JOIN registrations r ON t.registration_id = r.id
    WHERE r.user_id = {current_user_id};

```
