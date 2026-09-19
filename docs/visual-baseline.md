# Calendar Float visual baseline

CalendarCore keeps the rebuilt architecture, but the established Calendar Float visual language remains the product baseline.

This document records the parts intentionally restored from the old `calendar_float` widget without copying its business/runtime coupling.

## Floating button

Desktop baseline:

- 68 × 68 px
- 20 px rounded rectangle
- warm translucent gold surface
- blur + soft brown shadow
- initial position near the right edge at roughly 32vh
- draggable
- drag position is persisted in localStorage
- hidden while the panel is open

Mobile baseline:

- 52 × 52 px
- 16 px radius
- 23 px icon

## Window

Desktop baseline:

- maximum 1560 × 960
- approximately 20 px viewport margin
- 28 px outer radius
- warm translucent shell
- inner warm-white surface
- desktop window can be dragged by the top chrome
- calendar/detail use the old large two-column feeling

Mobile baseline:

- full-screen window
- no outer radius/border
- compact top chrome
- selecting a day opens the detail surface over the calendar
- explicit “返回月历” action returns to the month grid

## Month calendar

The restored direction uses:

- warm parchment/cream surfaces
- soft brown borders
- muted adjacent-month cells
- gold selected/today accents
- compact event chips
- 74 px mobile day-cell baseline
- right-side day detail on desktop

## Architecture rule

Only presentation and interaction are restored.

Do not move the old Worldbook parsing, reminder state, festival branching, archive state, or DOM-driven business logic into the renderer/shell.

CalendarCore UI consumes the framework-neutral UI model. Module-specific presentation must use the presentation-extension boundary instead of adding business-specific conditions to the generic Vue renderer.
