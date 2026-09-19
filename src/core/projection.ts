import {
  gregorianCalendarSystem,
  type CalendarSystem,
} from './calendar-system';
import {
  enumerateCalendarDateRange,
  isCalendarDateInsideRange,
} from './date';
import type {
  CalendarDateRange,
  CalendarDayProjection,
  CalendarOccurrence,
} from './types';

function occurrenceRange(occurrence: CalendarOccurrence): CalendarDateRange {
  return {
    start: occurrence.start.date,
    end: occurrence.end?.date ?? occurrence.start.date,
  };
}

export function projectCalendarDays(
  occurrences: readonly CalendarOccurrence[],
  targetRange: CalendarDateRange,
  system: CalendarSystem = gregorianCalendarSystem,
): CalendarDayProjection[] {
  return enumerateCalendarDateRange(targetRange, system).map(date => ({
    date,
    occurrences: occurrences.filter(occurrence =>
      isCalendarDateInsideRange(date, occurrenceRange(occurrence)),
    ),
  }));
}
