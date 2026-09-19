import {
  gregorianCalendarSystem,
  type CalendarSystem,
} from './calendar-system';
import type {
  CalendarDate,
  CalendarDateRange,
  CalendarWeekAnchor,
} from './types';

function assertInteger(value: number, label: string): void {
  if (!Number.isInteger(value)) {
    throw new RangeError(`${label} must be an integer`);
  }
}

function assertCalendarSystem(system: CalendarSystem, year: number): void {
  if (!Number.isInteger(system.daysInWeek) || system.daysInWeek < 1) {
    throw new RangeError(`Calendar system "${system.id}" returned an invalid week length`);
  }

  const monthsInYear = system.monthsInYear(year);
  if (!Number.isInteger(monthsInYear) || monthsInYear < 1) {
    throw new RangeError(`Calendar system "${system.id}" returned an invalid month count`);
  }
}

function readDaysInMonth(
  system: CalendarSystem,
  year: number,
  month: number,
): number {
  const days = system.daysInMonth(year, month);
  if (!Number.isInteger(days) || days < 1) {
    throw new RangeError(
      `Calendar system "${system.id}" returned an invalid day count`,
    );
  }
  return days;
}

export function cloneCalendarDate(date: CalendarDate): CalendarDate {
  return { year: date.year, month: date.month, day: date.day };
}

export function assertValidCalendarDate(
  date: CalendarDate,
  system: CalendarSystem = gregorianCalendarSystem,
): void {
  assertInteger(date.year, 'year');
  assertInteger(date.month, 'month');
  assertInteger(date.day, 'day');

  if (date.year < 1) {
    throw new RangeError('year must be at least 1');
  }

  assertCalendarSystem(system, date.year);
  const monthsInYear = system.monthsInYear(date.year);

  if (date.month < 1 || date.month > monthsInYear) {
    throw new RangeError(
      `month must be between 1 and ${monthsInYear} for calendar "${system.id}"`,
    );
  }

  const daysInMonth = readDaysInMonth(system, date.year, date.month);

  if (date.day < 1 || date.day > daysInMonth) {
    throw new RangeError(
      `day must be between 1 and ${daysInMonth} for ${date.year}-${date.month}`,
    );
  }
}

export function compareCalendarDate(left: CalendarDate, right: CalendarDate): number {
  if (left.year !== right.year) {
    return left.year - right.year;
  }
  if (left.month !== right.month) {
    return left.month - right.month;
  }
  return left.day - right.day;
}

export function isSameCalendarDate(left: CalendarDate, right: CalendarDate): boolean {
  return compareCalendarDate(left, right) === 0;
}

function nextMonth(
  date: Pick<CalendarDate, 'year' | 'month'>,
  system: CalendarSystem,
): Pick<CalendarDate, 'year' | 'month'> {
  const monthsInYear = system.monthsInYear(date.year);
  if (date.month < monthsInYear) {
    return { year: date.year, month: date.month + 1 };
  }

  return { year: date.year + 1, month: 1 };
}

function previousMonth(
  date: Pick<CalendarDate, 'year' | 'month'>,
  system: CalendarSystem,
): Pick<CalendarDate, 'year' | 'month'> {
  if (date.month > 1) {
    return { year: date.year, month: date.month - 1 };
  }

  if (date.year <= 1) {
    throw new RangeError('CalendarCore does not support dates before year 1');
  }

  const previousYear = date.year - 1;
  return {
    year: previousYear,
    month: system.monthsInYear(previousYear),
  };
}

export function addCalendarDays(
  date: CalendarDate,
  delta: number,
  system: CalendarSystem = gregorianCalendarSystem,
): CalendarDate {
  assertInteger(delta, 'delta');
  assertValidCalendarDate(date, system);

  let cursor = cloneCalendarDate(date);

  if (delta > 0) {
    let remaining = delta;

    while (remaining > 0) {
      const daysInMonth = readDaysInMonth(system, cursor.year, cursor.month);
      const daysAfterCursor = daysInMonth - cursor.day;

      if (remaining <= daysAfterCursor) {
        cursor.day += remaining;
        return cursor;
      }

      remaining -= daysAfterCursor + 1;
      const month = nextMonth(cursor, system);
      cursor = { ...month, day: 1 };
    }

    return cursor;
  }

  let remaining = -delta;

  while (remaining > 0) {
    if (remaining < cursor.day) {
      cursor.day -= remaining;
      return cursor;
    }

    remaining -= cursor.day;
    const month = previousMonth(cursor, system);
    cursor = {
      ...month,
      day: readDaysInMonth(system, month.year, month.month),
    };
  }

  return cursor;
}

export function addCalendarMonths(
  date: CalendarDate,
  delta: number,
  system: CalendarSystem = gregorianCalendarSystem,
): CalendarDate {
  assertInteger(delta, 'delta');
  assertValidCalendarDate(date, system);

  let cursor = { year: date.year, month: date.month };
  const direction = Math.sign(delta);

  for (let remaining = Math.abs(delta); remaining > 0; remaining -= 1) {
    cursor = direction > 0 ? nextMonth(cursor, system) : previousMonth(cursor, system);
  }

  return {
    ...cursor,
    day: Math.min(date.day, readDaysInMonth(system, cursor.year, cursor.month)),
  };
}

export function addCalendarYears(
  date: CalendarDate,
  delta: number,
  system: CalendarSystem = gregorianCalendarSystem,
): CalendarDate {
  assertInteger(delta, 'delta');
  assertValidCalendarDate(date, system);

  const year = date.year + delta;
  if (year < 1) {
    throw new RangeError('CalendarCore does not support dates before year 1');
  }

  const month = Math.min(date.month, system.monthsInYear(year));
  return {
    year,
    month,
    day: Math.min(date.day, readDaysInMonth(system, year, month)),
  };
}

function toCalendarOrdinal(
  date: CalendarDate,
  system: CalendarSystem,
): number {
  assertValidCalendarDate(date, system);

  let total = 0;

  for (let year = 1; year < date.year; year += 1) {
    assertCalendarSystem(system, year);
    const months = system.monthsInYear(year);
    for (let month = 1; month <= months; month += 1) {
      total += readDaysInMonth(system, year, month);
    }
  }

  for (let month = 1; month < date.month; month += 1) {
    total += readDaysInMonth(system, date.year, month);
  }

  return total + date.day - 1;
}

export function getCalendarDayDistance(
  from: CalendarDate,
  to: CalendarDate,
  system: CalendarSystem = gregorianCalendarSystem,
): number {
  return toCalendarOrdinal(to, system) - toCalendarOrdinal(from, system);
}

export function getCalendarWeekday(
  date: CalendarDate,
  anchor: CalendarWeekAnchor,
  system: CalendarSystem = gregorianCalendarSystem,
): number {
  assertValidCalendarDate(anchor.date, system);
  assertValidCalendarDate(date, system);

  if (
    !Number.isInteger(anchor.weekday) ||
    anchor.weekday < 0 ||
    anchor.weekday >= system.daysInWeek
  ) {
    throw new RangeError(
      `weekday must be between 0 and ${system.daysInWeek - 1}`,
    );
  }

  const raw =
    anchor.weekday +
    getCalendarDayDistance(anchor.date, date, system);

  return ((raw % system.daysInWeek) + system.daysInWeek) % system.daysInWeek;
}

export function ensureCalendarRangeOrder(range: CalendarDateRange): CalendarDateRange {
  if (compareCalendarDate(range.start, range.end) <= 0) {
    return {
      start: cloneCalendarDate(range.start),
      end: cloneCalendarDate(range.end),
    };
  }

  return {
    start: cloneCalendarDate(range.end),
    end: cloneCalendarDate(range.start),
  };
}

export function calendarRangesOverlap(
  left: CalendarDateRange,
  right: CalendarDateRange,
): boolean {
  return (
    compareCalendarDate(left.start, right.end) <= 0 &&
    compareCalendarDate(left.end, right.start) >= 0
  );
}

export function isCalendarDateInsideRange(
  date: CalendarDate,
  range: CalendarDateRange,
): boolean {
  return (
    compareCalendarDate(date, range.start) >= 0 &&
    compareCalendarDate(date, range.end) <= 0
  );
}

export function enumerateCalendarDateRange(
  range: CalendarDateRange,
  system: CalendarSystem = gregorianCalendarSystem,
): CalendarDate[] {
  assertValidCalendarDate(range.start, system);
  assertValidCalendarDate(range.end, system);

  if (compareCalendarDate(range.start, range.end) > 0) {
    throw new RangeError('Calendar date range start must not be after end');
  }

  const values: CalendarDate[] = [];
  let cursor = cloneCalendarDate(range.start);

  while (compareCalendarDate(cursor, range.end) <= 0) {
    values.push(cloneCalendarDate(cursor));
    cursor = addCalendarDays(cursor, 1, system);
  }

  return values;
}

export function formatCalendarDateKey(date: CalendarDate): string {
  const pad2 = (value: number) => String(value).padStart(2, '0');
  return `${date.year}-${pad2(date.month)}-${pad2(date.day)}`;
}
