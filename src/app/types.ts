import type {
  CalendarDateRange,
  CalendarDayProjection,
  CalendarEvent,
  CalendarOccurrence,
  CalendarPoint,
} from '../core';

export interface CalendarAppSnapshot {
  now: CalendarPoint;
  range: CalendarDateRange;
  events: CalendarEvent[];
  occurrences: CalendarOccurrence[];
  days: CalendarDayProjection[];
}
