# SillyTavern entrypoint

The runnable CalendarCore script accepts the structured contract and the existing Destiny MVU world-time string.

Preferred structured latest-message variables:

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

Alternative input:

stat_data.世界.时间 (e.g. 复兴纪元488年-04月-12日-星期三-11:45)

The world weekday provides the anchor, not the real Gregorian weekday for a fictional era.

Optional module data:

calendar.modules.festival

Festival data is parsed at runtime before it reaches the Festival adapter.

Build commands:

pnpm build
pnpm build:dev

Output:

dist/calendar-core-sillytavern.js

The production build is a single browser IIFE. Loading it starts the CalendarCore SillyTavern shell immediately.

Legacy Calendar Float worldbook/profile fields remain outside the entrypoint; only the explicit Destiny world-time string is adapted.

