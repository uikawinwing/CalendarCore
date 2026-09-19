# Legacy migration inventory

Source: `uikawinwing/calendar_float`

This file is a migration map, not a copy checklist.

## Migration status

- [x] Event/module normalization contract
- [x] Calendar date primitives and pure date arithmetic
- [x] Recurrence expansion
- [x] Range query / occurrence projection
- [x] Day / agenda-neutral projection
- [x] First real external module: Festival
- [ ] New host/app boundary
- [ ] New UI layer

## Extract as pure core candidates

The useful legacy concepts have been re-derived behind the new contract instead of copied wholesale:

- `DatePoint` / `DateRange` became `CalendarDate` / `CalendarDateRange`
- recurring-event expansion became `expandCalendarEventOccurrences`
- range lookup became `queryCalendarOccurrences`
- day grouping became `projectCalendarDays`

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
- reminder injection
- visual rendering

The legacy Chinese Worldbook shape is reference material only. This rebuild does **not** add a backward-compatibility bridge.

## Host integration stays outside core

Do not move these into `src/core`:

- SillyTavern / Tavern Helper lifecycle
- Worldbook scanning and writes
- host floating-button registration
- runtime variables
- UI widget state
- DOM / iframe / Vue rendering
- installation/diagnostic flows

A future host/app layer may depend on CalendarCore, never the reverse.

## Legacy coupling we are intentionally removing

Legacy `types.ts` mixed domain data, festivals, archive policy, view models, UI refs, and widget state in one file.

Legacy `calendar-view-model/model.ts` directly normalized festivals and used festival-specific visual/location logic.

Legacy `date.ts` mixed pure calendar arithmetic with parsing and presentation-specific rules.

Legacy recurring-event expansion parsed strings such as `每月15日` and `每周二` inside the view model. The new engine consumes normalized recurrence instead.

The new core must not gain imports or branches for named business modules such as `festival`, `class`, `quest`, or `ellia-ticket`. `checks/boundary.test.ts` enforces this direction.

## First migration gate

The engine-side migration gate is complete when unrelated module schemas can become events, expand into occurrences, be queried by range, and be projected into days without changing `src/core`.

That chain now exists:

```
module adapter
  -> CalendarEvent
  -> recurrence expansion
  -> CalendarOccurrence
  -> range query
  -> day projection
```

The next work belongs in the new host/app layer rather than adding more legacy behavior to Core.
