import {
  gregorianCalendarSystem,
  type CalendarSystem,
} from './calendar-system';
import { compareCalendarDate } from './date';
import { expandCalendarEventOccurrences } from './recurrence';
import type {
  CalendarDateRange,
  CalendarEvent,
  CalendarOccurrence,
} from './types';

function compareClock(
  left: CalendarOccurrence['start']['time'],
  right: CalendarOccurrence['start']['time'],
): number {
  if (!left && !right) return 0;
  if (!left) return -1;
  if (!right) return 1;
  return left.hour - right.hour || left.minute - right.minute;
}

export function queryCalendarOccurrences(
  events: readonly CalendarEvent[],
  targetRange: CalendarDateRange,
  system: CalendarSystem = gregorianCalendarSystem,
): CalendarOccurrence[] {
  return events
    .flatMap(event => expandCalendarEventOccurrences(event, targetRange, system))
    .sort((left, right) => {
      const dateOrder = compareCalendarDate(left.start.date, right.start.date);
      if (dateOrder !== 0) return dateOrder;

      const timeOrder = compareClock(left.start.time, right.start.time);
      if (timeOrder !== 0) return timeOrder;

      return (
        left.event.title.localeCompare(right.event.title) ||
        left.event.id.localeCompare(right.event.id) ||
        left.occurrenceIndex - right.occurrenceIndex
      );
    });
}
