# History / Completed records

History is an explicit record of something that already happened.

Runtime path:

calendar.modules.history

Fields:

- id
- title
- occurredAt
- optional source { moduleId, eventId }
- optional outcome
- optional notes
- optional tags/metadata

## Why History is separate

CalendarCore can already display past occurrences of Event, Appointment, Class, Festival, and other modules.

History exists for stored journal/completion semantics: a durable record saying what actually happened.

Creating a History record does not mutate the source event and does not require the source event to still exist.

This lets Task/Quest systems later write completion records into Calendar without making Calendar own task status, objectives, rewards, or progress.

## No recurrence

History records are one-time facts. They never recur.

If a repeating event is completed many times, each completed occurrence may produce its own History record.
