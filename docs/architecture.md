# Architecture

CalendarCore is split into four directions with one-way dependencies.

```text
host adapters
    |
    v
app
    |
    +------> business modules
    |             |
    v             v
             core engine
```

More explicitly:

```text
src/core/
  calendar-system
  date
  recurrence
  query
  projection
  registry

src/modules/
  festival
  future: class / birthday / anniversary / ...

src/app/
  ports
  module composition
  snapshot building

src/host/
  contracts and future host-specific adapters
```

## Core

Core contains calendar-neutral mechanics only.

It must not know about Festival, SillyTavern, Worldbook, UI widgets, books, tickets, quests, or any other business feature.

## Modules

A module owns one business concept and translates its source data into `CalendarEvent`.

Modules depend on Core. Core never depends on modules.

## App

App composes multiple modules.

It owns:

- module registration
- loading module inputs
- obtaining current world time through a port
- turning events into occurrences and day projections
- returning a UI-ready snapshot without UI markup

App does not read Worldbook or browser globals directly.

## Host

Host adapters provide environment-specific capabilities such as world time or data access.

A future SillyTavern host belongs here. It may implement App ports, but App and Core must not import SillyTavern APIs.

## UI

UI is not part of this layer yet.

The UI should consume `CalendarAppSnapshot` and dispatch user intents back through App/module APIs instead of reading module storage directly.
