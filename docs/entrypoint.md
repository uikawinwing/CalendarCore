# SillyTavern entrypoint

The first runnable CalendarCore script uses the new structured runtime contract only.

Required latest-message variables:

calendar.now
  date.year
  date.month
  date.day
  optional time.hour
  optional time.minute

calendar.weekAnchor
  date.year
  date.month
  date.day
  weekday

Optional module data:

calendar.modules.festival

Festival data is parsed at runtime before it reaches the Festival adapter.

Build commands:

pnpm build
pnpm build:dev

Output:

dist/calendar-core-sillytavern.js

The production build is a single browser IIFE. Loading it starts the CalendarCore SillyTavern shell immediately.

Legacy Calendar Float worldbook/profile fields are intentionally not read by this entrypoint.
