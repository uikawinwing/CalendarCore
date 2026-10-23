# Creator Profiles

Profiles are **optional host-data adapters**. They do not belong in `src/core`, `src/app`, event modules or Vue.

A Profile only maps external message variables into the existing `CalendarPoint` / `CalendarWeekAnchor` contract. It may advertise other known paths for future plugins; **metadata paths do not automatically become dated events, triggers or MVU writes**.

## Included: 命定之诗 (Fate Poem)

Source: private `uikawinwing/Worldbook-for-destined-journey`, branch `main` (inspected 2026-10-23), using:

- `命定之诗/变量/[InitVar]世界初始设定.yaml` — `世界.时间`, `世界.地点`, `事件` initial state
- `命定之诗/变量/[mvu_update]变量更新规则.yaml` — time format `某某纪元YYY年-MM月-DD日-星期X-HH:mm`
- `命定之诗/事件/事件信号变量适配.ejs` — optional `事件.信号: string[]`
- `命定之诗/变量/variables.ejs` — `事件` deliberately omitted from the rendered variable summary; it still exists in MVU

Profile implementation: `src/profiles/fate-poem.ts`.

| Field | MVU path | What CC currently does |
| --- | --- | --- |
| World time | `stat_data.世界.时间` | Parse date, clock and weekday anchor |
| Location | `stat_data.世界.地点` | Path metadata only |
| Narrative event state | `stat_data.事件` | Path metadata only; **not** calendar schedule |
| Completed events | `stat_data.事件.已完成事件` | Path metadata only |
| Optional event signals | `stat_data.事件.信号` | Path metadata only; **never** auto-execute |

Actual format example: `复兴纪元488年-04月-12日-星期三-11:45`. Weekday is taken from the fictional world's value, not recalculated from Gregorian history.

The initial worldbook time is an empty string. Until an LLM turn populates a valid time, the calendar shell remains in the waiting state.

## Boundaries

- The universal ST readiness adapter first accepts `calendar.now` + `calendar.weekAnchor`.
- Otherwise it evaluates profiles supplied by the entrypoint. The first valid match wins.
- Without an installed profile, the generic runtime does **not** scan Fate Poem paths.
- Missing or invalid data leaves a visible waiting state, never writes default MVU fields.
- Dated calendar events require a separate event-list source and parser. The existing narrative flags `开启/结束/标题/阶段` have no absolute event date; do not turn them into synthetic calendar events.

## Add another creator profile

Create `src/profiles/<your-world>.ts` implementing the `CalendarProfile` interface exported from `src/profiles/types.ts`; define time parsing and paths there. Register it in the `bundledCalendarProfiles` list in `src/profiles/index.ts`. Do not edit `src/core`, `src/integrations/sillytavern/readiness.ts` or the eight built-in event modules.

External runtime plugin discovery/loading and custom event triggers are **not implemented yet**. This is the first isolated creator Profile; no claim of general arbitrary-schema auto-inference.
