# UI model

The UI layer begins with presentation models, not a rendering framework.

## Why

Legacy Calendar Float mixed:

- recurrence expansion
- Festival normalization
- reminder state
- source priority
- chip row layout
- month-grid calculation
- DOM rendering

inside the same view-model path.

The rebuild keeps the first UI contract intentionally small.

## Month view

`getCalendarMonthGridRange()` computes the full visible grid including leading/trailing cells.

`buildCalendarMonthViewModel()` maps a `CalendarAppSnapshot` into cells containing only:

- date/key
- weekday
- current-month flag
- today flag
- selected flag
- occurrences for that day

It contains no Festival-specific marker logic and no DOM/HTML.

## Rendering framework

No Vue/React/vanilla decision is required yet.

A renderer should consume `CalendarMonthViewModel`. Replacing the renderer must not require changing Core, modules, App, or host adapters.
