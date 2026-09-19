# Runtime contract

The new product does not require CalendarCore to understand SillyTavern or legacy Calendar Float schemas.

A host supplies two categories of data to CalendarApp.

## Current world time

Recommended structured shape:

```json
{
  "date": {
    "year": 1002,
    "month": 12,
    "day": 31
  },
  "time": {
    "hour": 20,
    "minute": 30
  }
}
```

A character card may use another format. In that case the host config supplies a `CalendarTimeParser`.

The parser belongs at the host/configuration boundary, not in Core.

## Module data

Each module owns its input schema.

The SillyTavern host can expose module data from any message-variable path through `SillyTavernMessageModuleSource<T>`.

The source requires an explicit parser:

```text
message variable
   ↓
module-specific parser
   ↓
module input
   ↓
module adapter
   ↓
CalendarEvent
```

This prevents unvalidated SillyTavern data from leaking directly into CalendarCore.

## Example layout

A new character card may choose a clean structure such as:

```text
calendar
├─ now
└─ modules
   ├─ festival
   ├─ class
   └─ ...
```

This is a recommendation, not a Core requirement. Paths remain configurable.

## Legacy data

Legacy Calendar Float fields and Worldbook structures are not part of this contract.

If a specific character card needs a different format, implement a small parser/source for that card or module rather than extending CalendarCore with compatibility branches.
