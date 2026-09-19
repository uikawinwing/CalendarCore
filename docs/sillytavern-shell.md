# SillyTavern shell

The SillyTavern shell is an outer integration layer.

It is the first place allowed to compose SillyTavern Host adapters, CalendarApp, UI session/model, Vue renderer, and browser DOM lifecycle.

Why this is not in Host:

- src/host/sillytavern translates SillyTavern capabilities into App ports.
- Host must remain usable without Vue or any specific UI.
- integrations/sillytavern deliberately assembles the whole product.

Bridge responsibilities:

- latest-message variable reader
- current-world-time source
- CalendarApp
- generic module sources
- CalendarMonthSession

Shell responsibilities:

- one floating calendar button in the host page
- one isolated srcdoc iframe panel
- one Vue month renderer inside that iframe
- Escape-to-close
- pagehide cleanup
- hot-reload replacement of an older shell instance

The panel intentionally excludes editors, settings, reminders, archive/history, and module-specific visual effects.

No lower layer imports integrations.
