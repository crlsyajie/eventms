┌─────────────────────────────────────────────────────────────────────────────┐
│                           EVENT MANAGEMENT SYSTEM ERD                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│        users         │
├──────────────────────┤
│ PK  id               │
│     username         │
│     email            │
│     password         │
│     is_admin         │
│     is_client        │
│     first_name       │
│     last_name        │
│     is_staff         │
│     is_active        │
│     date_joined      │
└──────────────────────┘
         │
         │ 1
         │
         ├─────────────────────────────────────┐
         │                                     │
         ▼ N                                   ▼ N
┌──────────────────────┐              ┌──────────────────────┐
│       events         │              │    registrations     │
├──────────────────────┤              ├──────────────────────┤
│ PK  id               │              │ PK  id               │
│     title            │              │ FK  event_id ────────┼───┐
│     description      │              │ FK  user_id          │   │
│     date             │              │     user_name        │   │
│     location         │              │     status           │   │
│     is_paid          │              │     registered_at    │   │
│     price            │              └──────────────────────┘   │
│     status           │                        │                │
│ FK  submitted_by ────┼── (to users)           │ 1              │
└──────────────────────┘                        │                │
         │ 1                                    ▼ N              │
         │                              ┌──────────────────────┐ │
         │                              │       tickets        │ │
         │                              ├──────────────────────┤ │
         │                              │ PK  id               │ │
         └──────────────────────────────┼─ FK  event_id        │ │
                                        │ FK  registration_id  │◀┘
                                        │     seat             │
                                        │     issued_at        │
                                        └──────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            RELATIONSHIPS SUMMARY                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   RELATIONSHIP                      TYPE              FK LOCATION            │
│   ─────────────────────────────────────────────────────────────────────────  │
│   users → events                    One-to-Many (1:N)  events.submitted_by   │
│   users → registrations             One-to-Many (1:N)  registrations.user_id │
│   events → registrations            One-to-Many (1:N)  registrations.event_id│
│   events → tickets                  One-to-Many (1:N)  tickets.event_id      │
│   registrations → tickets           One-to-Many (1:N)  tickets.registration_id│
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│   NO One-to-One (1:1) relationships                                          │
│   NO Many-to-Many (M:N) relationships (in application tables)               │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                              KEYS SUMMARY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   TABLE              PRIMARY KEY     FOREIGN KEYS                            │
│   ─────────────────────────────────────────────────────────────────────────  │
│   users              id              (none)                                  │
│   events             id              submitted_by → users.id                 │
│   registrations      id              event_id → events.id                    │
│                                      user_id → users.id                      │
│   tickets            id              event_id → events.id                    │
│                                      registration_id → registrations.id     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘