# Legacy migration inventory

Source: `uikawinwing/calendar_float`

This file is a migration map, not a copy checklist.

## Migration status

- [x] Event/module normalization contract
- [x] Calendar date primitives and pure date arithmetic
- [x] Recurrence expansion
- [x] Range query / occurrence projection
- [x] First real external module: Festival
- [ ] Legacy Worldbook -> Festival bridge
- [ ] Host package boundary

## Extract as pure core candidates

The useful legacy concepts have been re-derived behind the new contract instead of copied wholesale:

- `DatePoint` / `DateRange` became `CalendarDate` / `CalendarDateRange`
- recurring-event expansion became `expandCalendarEventOccurrences`
- range lookup became `queryCalendarOccurrences`

The old date helper hard-coded Gregorian rules and mixed date math with parsing, era aliases, Chinese numerals, weekday labels, and native `Date`. The new date layer separates those concerns and accepts an injected `CalendarSystem`.

The old recurrence code also mixed parsing of Chinese UI text with occurrence generation. CalendarCore now expects normalized recurrence data. Parsing phrases such as `每周二` belongs in an adapter, not the engine.

## Festival module

`src/modules/festival` is the first real business module.

It owns:

- festival and stage semantics
- cross-year festival ranges
- yearly interval recurrence
- festival-only payload such as related books and location keywords

It does not own:

- Worldbook reads
- Chinese legacy source keys such as `名称`, `开始`, `周期`
- reminder injection
- visual rendering

Those belong to a later host/legacy bridge.

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

The new core must not gain imports or branches for named business modules such as `festival`, `class`, `quest`, or `ellia-ticket`. `checks/boundary.test.ts` enforces this direction.

## First migration gate

The first milestone is complete when unrelated fixture schemas normalize through registered adapters without any change to `src/core`.

The current fixture set covers Festival, Class, Appointment, and Ellia ticket. The Festival fixture has now been replaced by a real module implementation.
