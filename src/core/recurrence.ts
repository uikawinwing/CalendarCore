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

function shiftOccurrenceDate(
  date: CalendarDate,
  event: CalendarEvent,
  occurrenceIndex: number,
  system: CalendarSystem,
): CalendarDate {
  const recurrence = event.recurrence;
  if (!recurrence || occurrenceIndex === 0) {
    return date;
  }

  const interval = getRecurrenceInterval(event) * occurrenceIndex;

  switch (recurrence.frequency) {
    case 'daily':
      return addCalendarDays(date, interval, system);
    case 'weekly':
      return addCalendarDays(date, interval * system.daysInWeek, system);
    case 'monthly':
      return addCalendarMonths(date, interval, system);
    case 'yearly':
      return addCalendarYears(date, interval, system);
  }
}

function occurrencePoint(
  point: CalendarPoint,
  event: CalendarEvent,
  occurrenceIndex: number,
  system: CalendarSystem,
): CalendarPoint {
  return {
    date: shiftOccurrenceDate(point.date, event, occurrenceIndex, system),
    ...(point.time ? { time: { ...point.time } } : {}),
  };
}

function createOccurrence(
  event: CalendarEvent,
  occurrenceIndex: number,
  system: CalendarSystem,
): CalendarOccurrence {
  const start = occurrencePoint(event.start, event, occurrenceIndex, system);
  const end = event.end
    ? occurrencePoint(event.end, event, occurrenceIndex, system)
    : undefined;

  if (end && compareCalendarDate(end.date, start.date) < 0) {
    throw new RangeError('Calendar event end must not be before start');
  }

  return {
    event,
    occurrenceIndex,
    start,
    ...(end ? { end } : {}),
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

    if (compareCalendarDate(event.end.date, event.start.date) < 0) {
      throw new RangeError('Calendar event end must not be before start');
    }
  }

  if (!event.recurrence) {
    const occurrence = createOccurrence(event, 0, system);
    return calendarRangesOverlap(occurrenceDateRange(occurrence), targetRange)
      ? [occurrence]
      : [];
  }

  getRecurrenceInterval(event);

  const recurrenceUntil = event.recurrence.until;
  if (recurrenceUntil) {
    assertValidCalendarDate(recurrenceUntil, system);

    if (compareCalendarDate(recurrenceUntil, event.start.date) < 0) {
      throw new RangeError(
        'Calendar recurrence until must not be before event start',
      );
    }
  }

  if (!Number.isInteger(system.daysInWeek) || system.daysInWeek < 1) {
    throw new RangeError(
      'Calendar system "' +
        system.id +
        '" returned an invalid week length',
    );
  }

  const occurrences: CalendarOccurrence[] = [];
  let occurrenceIndex = 0;

  while (true) {
    const occurrence = createOccurrence(event, occurrenceIndex, system);

    if (compareCalendarDate(occurrence.start.date, targetRange.end) > 0) {
      break;
    }

    if (
      recurrenceUntil &&
      compareCalendarDate(occurrence.start.date, recurrenceUntil) > 0
    ) {
      break;
    }

    if (calendarRangesOverlap(occurrenceDateRange(occurrence), targetRange)) {
      occurrences.push(occurrence);
    }

    occurrenceIndex += 1;
  }

  return occurrences;
}
