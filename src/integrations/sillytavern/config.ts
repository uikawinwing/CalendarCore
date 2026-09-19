import type {
  CalendarDate,
  CalendarWeekAnchor,
} from '../../core';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readPositiveInteger(value: unknown): number | null {
  return Number.isInteger(value) && Number(value) > 0
    ? Number(value)
    : null;
}

function parseDate(value: unknown): CalendarDate | null {
  if (!isRecord(value)) {
    return null;
  }

  const year = readPositiveInteger(value.year);
  const month = readPositiveInteger(value.month);
  const day = readPositiveInteger(value.day);

  return year && month && day
    ? { year, month, day }
    : null;
}

export function parseCalendarWeekAnchor(
  value: unknown,
): CalendarWeekAnchor | null {
  if (!isRecord(value)) {
    return null;
  }

  const date = parseDate(value.date);
  const weekday = Number.isInteger(value.weekday)
    ? Number(value.weekday)
    : null;

  if (!date || weekday === null || weekday < 0) {
    return null;
  }

  return { date, weekday };
}
