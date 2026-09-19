# Birthday and Anniversary modules

Birthday and Anniversary are deliberately separate business modules even though both normalize to yearly recurrence.

## Birthday

Runtime path:

calendar.modules.birthday

Fields:

- id
- title
- date (full origin date)
- optional subject
- optional notes
- optional tags/metadata

The original date is preserved in payload.originDate so a future UI can calculate age or elapsed years without teaching Core about birthdays.

## Anniversary

Runtime path:

calendar.modules.anniversary

Fields:

- id
- title
- date (full origin date)
- optional category
- optional notes
- optional tags/metadata

The original date is preserved for future anniversary-specific presentation.

## Recurrence

Both modules normalize to yearly recurrence in CalendarCore.

Leap-day behavior currently follows CalendarCore yearly date clamping. A future module-level policy can be added if a character/world needs a different Feb-29 convention; it is intentionally not hard-coded into the generic engine now.
