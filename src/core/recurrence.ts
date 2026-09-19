import {
  gregorianCalendarSystem,
  type CalendarSystem,
} from './calendar-system';
import {
  addCalendarDays,
  addCalendarMonths,
  addCalendarYears,
  assertValidCalendarDate,
  calendarRangesOverlap,
  compareCalendarDate,
  getCalendarDayDistance,
} from './date';
import type {
  CalendarDate,
  CalendarDateRange,
  CalendarEvent,
  CalendarOccurrence,
  CalendarPoint,
} from './types';

function assertRange(range: CalendarDateRange, system: CalendarSystem): void {
  assertValidCalendarDate(range.start, system);
  assertValidCalendarDate(range.end, system);

  if (compareCalendarDate(range.start, range.end) > 0) {
    throw new RangeError('Calendar date range start must not be after end');
  }
}

function getRecurrenceInterval(event: CalendarEvent): number {
  const interval = event.recurrence?.interval ?? 1;
  if (!Number.isInteger(interval) || interval < 1) {
    throw new RangeError('Calendar recurrence interval must be a positive integer');
  }
  return interval;
}

function getOccurrenceStartDate(
  event: CalendarEvent,
  occurrenceIndex: number,
  system: CalendarSystem,
): CalendarDate {
  const recurrence = event.recurrence;
  if (!recurrence || occurrenceIndex === 0) {
    return event.start.date;
  }

  const interval = getRecurrenceInterval(event) * occurrenceIndex;

  switch (recurrence.frequency) {
    case 'daily':
      return addCalendarDays(event.start.date, interval, system);
    case 'weekly':
      return addCalendarDays(event.start.date, interval * system.daysInWeek, system);
    case 'monthly':
      return addCalendarMonths(event.start.date, interval, system);
    case 'yearly':
      return addCalendarYears(event.start.date, interval, system);
  }
}

function clonePointWithDate(point: CalendarPoint, date: CalendarDate): CalendarPoint {
  return {
    date,
    ...(point.time ? { time: { ...point.time } } : {}),
  };
}

function createOccurrence(
  event: CalendarEvent,
  occurrenceIndex: number,
  startDate: CalendarDate,
  durationDays: number,
  system: CalendarSystem,
): CalendarOccurrence {
  const start = clonePointWithDate(event.start, startDate);

  if (!event.end) {
    return { event, occurrenceIndex, start };
  }

  const endDate = addCalendarDays(startDate, durationDays, system);
  return {
    event,
    occurrenceIndex,
    start,
    end: clonePointWithDate(event.end, endDate),
  };
}

function occurrenceDateRange(occurrence: CalendarOccurrence): CalendarDateRange {
  return {
    start: occurrence.start.date,
    end: occurrence.end?.date ?? occurrence.start.date,
  };
}

export function expandCalendarEventOccurrences(
  event: CalendarEvent,
  targetRange: CalendarDateRange,
  system: CalendarSystem = gregorianCalendarSystem,
): CalendarOccurrence[] {
  assertRange(targetRange, system);
  assertValidCalendarDate(event.start.date, system);

  if (event.end) {
    assertValidCalendarDate(event.end.date, system);
  }

  const durationDays = event.end
    ? getCalendarDayDistance(event.start.date, event.end.date, system)
    : 0;

  if (durationDays < 0) {
    throw new RangeError('Calendar event end must not be before start');
  }

  if (!event.recurrence) {
    const occurrence = createOccurrence(event, 0, event.start.date, durationDays, system);
    return calendarRangesOverlap(occurrenceDateRange(occurrence), targetRange)
      ? [occurrence]
      : [];
  }

  getRecurrenceInterval(event);

  if (!Number.isInteger(system.daysInWeek) || system.daysInWeek < 1) {
    throw new RangeError(`Calendar system "${system.id}" returned an invalid week length`);
  }

  const occurrences: CalendarOccurrence[] = [];
  let occurrenceIndex = 0;

  while (true) {
    const startDate = getOccurrenceStartDate(event, occurrenceIndex, system);
    if (compareCalendarDate(startDate, targetRange.end) > 0) {
      break;
    }

    const occurrence = createOccurrence(
      event,
      occurrenceIndex,
      startDate,
      durationDays,
      system,
    );

    if (calendarRangesOverlap(occurrenceDateRange(occurrence), targetRange)) {
      occurrences.push(occurrence);
    }

    occurrenceIndex += 1;
  }

  return occurrences;
}
