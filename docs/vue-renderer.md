# Vue renderer

The Vue renderer is an adapter over the framework-neutral UI layer.

## Dependency direction

```text
Vue renderer
    ↓
UI session/model
    ↓
CalendarApp
    ↓
CalendarCore
```

The renderer must not directly import Core, modules, Host, or SillyTavern APIs.

## First milestone

The first renderer supports:

- month title
- previous / next month navigation
- weekday labels
- full month grid including adjacent-month cells
- today state
- selected-date state
- generic occurrence labels
- occurrence overflow count
- desktop/mobile responsive sizing

It intentionally does not support:

- Festival-specific markers
- editing forms
- reminders
- archive/history
- floating-ball integration
- module-specific detail panels

Those features should be added through explicit UI contracts instead of inspecting Festival or Host data inside Vue.

## Mounting

`mountVueCalendarMonth()` mounts into a caller-provided container and keeps its stylesheet local to that container.

The returned handle supports:

- `refresh()`
- `destroy()`

Month navigation and date selection are backed by `CalendarMonthSession`, so Vue does not own data loading or calendar calculations.
