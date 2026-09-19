# Reminder module

The Reminder module represents reminder semantics on the calendar.

Runtime path:

calendar.modules.reminder

Fields:

- id
- title
- at
- optional recurrence
- optional message
- optional target
- optional tags/metadata

A target is a loose relation:

moduleId
eventId

For example, a reminder can point to an Appointment without importing the Appointment module.

## Delivery is outside the module

This module does not schedule browser timers, SillyTavern notifications, toasts, or push notifications.

It only normalizes reminder data into CalendarEvent/CalendarOccurrence.

A future App/Host delivery service can query reminder occurrences and decide when/how to notify the player.

This keeps notification APIs out of CalendarCore and keeps Reminder usable in non-browser hosts.
