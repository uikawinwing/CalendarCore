# CalendarCore

A clean-room rebuild of calendar_float.

## Current milestone

The first end-to-end vertical slice is working:

module data
→ CalendarEvent
→ recurrence
→ range query
→ day projection
→ CalendarApp
→ month UI model
→ Vue renderer
→ SillyTavern iframe shell
→ single-file browser bundle

The legacy Calendar Float repository remains reference-only:

https://github.com/uikawinwing/calendar_float

No backward-compatibility layer is planned.

## Architecture

- src/core — calendar-neutral date, recurrence, query and projection engine
- src/modules — business modules such as Festival
- src/app — module composition and snapshots
- src/host — environment ports/adapters
- src/ui — framework-neutral presentation models and sessions
- src/renderers — framework-specific rendering
- src/integrations — whole-product assembly such as SillyTavern
- src/entrypoints — runnable browser entrypoints

Dependency direction is guarded by checks/boundary.test.ts.

## SillyTavern runtime contract

The first runnable entrypoint reads latest-message variables from the new schema.

Required:

- calendar.now
- calendar.weekAnchor

Optional:

- calendar.modules.festival

Minimal example:

```json
{
  "calendar": {
    "now": {
      "date": {
        "year": 1002,
        "month": 12,
        "day": 31
      },
      "time": {
        "hour": 20,
        "minute": 30
      }
    },
    "weekAnchor": {
      "date": {
        "year": 1002,
        "month": 12,
        "day": 31
      },
      "weekday": 2
    },
    "modules": {
      "festival": [
        {
          "id": "new-year",
          "title": "跨年祭",
          "start": {
            "month": 12,
            "day": 30
          },
          "end": {
            "month": 1,
            "day": 3
          },
          "anchorYear": 1000,
          "repeatEveryYears": 2
        }
      ]
    }
  }
}
```

See docs/entrypoint.md and docs/runtime-contract.md for the structured fields.

## Build

Development checks:

```bash
pnpm install
pnpm check
```

Production bundle:

```bash
pnpm build
```

Output:

```text
dist/calendar-core-sillytavern.js
```

## Test import URL

After the bundle workflow publishes dist on main:

```text
https://cdn.jsdelivr.net/gh/uikawinwing/CalendarCore@main/dist/calendar-core-sillytavern.js
```

The main-branch URL is for active testing. Stable releases should use a version tag instead of main.
