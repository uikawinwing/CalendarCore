# Event and Appointment modules

These modules cover ordinary calendar activity without pulling task/quest state into CalendarCore.

## Event

Event owns generic scheduled activity:

- title
- start / optional end
- all-day flag
- optional recurrence
- summary
- tags
- metadata

Runtime path:

calendar.modules.event

## Appointment

Appointment owns scheduled meetings/appointments and adds:

- location
- attendees
- notes

Runtime path:

calendar.modules.appointment

Appointment is intentionally separate from Event so later UI can offer meeting-specific details without teaching Core or Event about people/locations.

## Not included

These fields do not belong here:

- completion/progress
- objectives
- rewards
- task importance
- quest state

Those belong to the future Quest/Task projection module.

Both modules use the same calendar-neutral recurrence engine after normalization.
