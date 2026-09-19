# Legacy migration inventory

Source: `uikawinwing/calendar_float`

This file is a migration map, not a copy checklist.

## Migration status

- [x] Event/module normalization contract
- [x] Calendar date primitives and pure date arithmetic
- [x] Recurrence expansion
- [x] Range query / occurrence projection
- [ ] Host package boundary
- [ ] First real external module

## Extract as pure core candidates

The useful legacy concepts have been re-derived behind the new contract instead of copied wholesale:

- `DatePoint` / `DateRange` became `CalendarDate` / `CalendarDateRange`
- recurring-event expansion became `expandCalendarEventOccurrences`
- range lookup became `queryCalendarOccurrences`

The old date helper hard-coded Gregorian rules and mixed date math with parsing, era aliases, Chinese numerals, weekday labels, and native `Date`. The new date layer separates those concerns and accepts an injected `CalendarSystem`.

The old recurrence code also mixed parsing of Chinese UI text with occurrence generation. CalendarCore now expects normalized recurrence data. Parsing phrases such as `每周二` belongs in an adapter, not the engine.

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

Legacy `date.ts` mixed pure calendar arithmetic with parsing and presentation-specific rules.

Legacy recurring-event expansion parsed strings such as `每月15日` and `每周二` inside the view model. The new engine consumes normalized recurrence instead.

The new core must not gain imports or branches for named business modules such as `festival`, `class`, `quest`, or `ellia-ticket`.

## First migration gate

The first milestone is complete when four unrelated fixture schemas normalize through registered adapters without any change to `src/core`.

Current fixtures:

1. Festival
2. Class
3. Appointment
4. Ellia ticket
