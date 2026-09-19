# Legacy migration inventory

Source: `uikawinwing/calendar_float`

This file is a migration map, not a copy checklist.

## Extract later as pure core candidates

These concepts are useful, but should be re-derived behind the new contract instead of copied wholesale:

- `DatePoint` / `DateRange` style fantasy-calendar coordinates
- pure date arithmetic and range overlap helpers
- recurrence expansion behavior
- month/day query behavior
- focused regression checks for pure calculations

## Rewrite as external modules/adapters

These are business features, not CalendarCore responsibilities:

- festivals and festival stages
- classes / courses
- birthdays and anniversaries
- quests / task projections
- Ellia tickets and other collectible records
- reminders
- archive/history policy

Each module owns its source schema and translates it into `CalendarEvent`.

## Host integration stays outside core

Do not move these into `src/core`:

- SillyTavern / Tavern Helper lifecycle
- Worldbook scanning and writes
- host floating-button registration
- runtime variables
- UI widget state
- DOM / iframe / Vue rendering
- installation/diagnostic flows

A future host package may depend on CalendarCore, never the reverse.

## Legacy coupling we are intentionally removing

Legacy `types.ts` mixed domain data, festivals, archive policy, view models, UI refs, and widget state in one file.

Legacy `calendar-view-model/model.ts` directly normalized festivals and used festival-specific visual/location logic.

The new core must not gain imports or branches for named business modules such as `festival`, `class`, `quest`, or `ellia-ticket`.

## First migration gate

The first milestone is complete when four unrelated fixture schemas normalize through registered adapters without any change to `src/core`.

Current fixtures:

1. Festival
2. Class
3. Appointment
4. Ellia ticket
