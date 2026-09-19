# UI model

The UI layer begins with presentation models, not business-module payloads.

## Month view

`getCalendarMonthGridRange()` computes the full visible grid including leading/trailing cells.

`buildCalendarMonthViewModel()` maps a `CalendarAppSnapshot` into cells containing:

- date/key
- weekday
- current-month flag
- today flag
- selected flag
- occurrences for that day

## Selected-day detail

When a visible date is selected, `CalendarMonthViewModel.selectedDay` exposes a framework-neutral `CalendarDayViewModel`.

Each occurrence is reduced to common calendar fields:

- event/occurrence identity
- moduleId
- kind
- title
- all-day flag
- start/end
- tags

Business-module `payload` is deliberately not exposed to the generic renderer.

The Vue month renderer uses this model for a desktop side panel / mobile below-calendar agenda.

## Future module-specific presentation

Festival books, Class-specific details, Ellia tickets, Quest rewards, and similar features should use an explicit presentation-extension contract.

Do not add `if (kind === ...)` branches to the generic month renderer and do not expose raw module payload simply to make special UI easier.
