import type {
  CalendarPoint,
  CalendarRecurrence,
  CalendarRecurrenceFrequency,
} from '../../core';

export function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const text = value.trim();
  return text ? text : null;
}

export function readBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

export function readPositiveInteger(value: unknown): number | null {
  return Number.isInteger(value) && Number(value) > 0
    ? Number(value)
    : null;
}

export function readStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const output: string[] = [];
  for (const item of value) {
    const text = readNonEmptyString(item);
    if (!text) {
      return null;
    }
    output.push(text);
  }

  return output;
}

export function readMetadata(
  value: unknown,
): Readonly<Record<string, unknown>> | null {
  return isRecord(value) ? { ...value } : null;
}

function readCalendarDate(value: unknown): CalendarPoint['date'] | null {
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

function readCalendarClock(value: unknown): CalendarPoint['time'] | null {
  if (!isRecord(value)) {
    return null;
  }

  const hour = Number.isInteger(value.hour)
    ? Number(value.hour)
    : null;
  const minute = Number.isInteger(value.minute)
    ? Number(value.minute)
    : null;

  if (
    hour === null ||
    minute === null ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return { hour, minute };
}

export function parseCalendarPoint(value: unknown): CalendarPoint | null {
  if (!isRecord(value)) {
    return null;
  }

  const date = readCalendarDate(value.date);
  if (!date) {
    return null;
  }

  if ('time' in value && typeof value.time !== 'undefined') {
    const time = readCalendarClock(value.time);
    if (!time) {
      return null;
    }
    return { date, time };
  }

  return { date };
}

const RECURRENCE_FREQUENCIES = new Set<CalendarRecurrenceFrequency>([
  'daily',
  'weekly',
  'monthly',
  'yearly',
]);

export function parseCalendarRecurrence(
  value: unknown,
): CalendarRecurrence | null {
  if (!isRecord(value)) {
    return null;
  }

  const frequency =
    typeof value.frequency === 'string' &&
    RECURRENCE_FREQUENCIES.has(
      value.frequency as CalendarRecurrenceFrequency,
    )
      ? (value.frequency as CalendarRecurrenceFrequency)
      : null;

  if (!frequency) {
    return null;
  }

  if ('interval' in value && typeof value.interval !== 'undefined') {
    const interval = readPositiveInteger(value.interval);
    if (!interval) {
      return null;
    }
    return { frequency, interval };
  }

  return { frequency };
}
