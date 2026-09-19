# CalendarCore

A clean-room rebuild of `calendar_float`.

## Goal

CalendarCore is a host-agnostic calendar engine. It owns calendar-neutral concepts such as dates, event normalization contracts, recurrence/querying, and module registration.

Business features such as festivals, classes, quests, birthdays, anniversaries, tickets, books, and SillyTavern/Worldbook integration belong outside the core and connect through adapters/modules.

## Migration rule

The legacy repository remains reference-only:

- https://github.com/uikawinwing/calendar_float

Do **not** copy the legacy `src/calendar-float` tree into this repository. Migrate behavior deliberately, one contract or pure algorithm at a time, with focused checks.

## First milestone

Prove that four unrelated inputs can become calendar events without changing CalendarCore:

- Festival
- Class
- Appointment
- Ellia ticket

UI, Worldbook integration, storage, reminders, and legacy compatibility are intentionally out of scope for this first milestone.
