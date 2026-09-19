import type {
  CalendarPoint,
  CalendarTimeSource,
} from '../../app';
import {
  readValueAtPath,
  SillyTavernMessageVariableReader,
} from './message-variables';

export type CalendarTimeParser = (value: unknown) => CalendarPoint | null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readInteger(
  record: Record<string, unknown>,
  key: string,
): number | null {
  const value = record[key];
  return Number.isInteger(value) ? Number(value) : null;
}

function parseDateRecord(value: unknown): CalendarPoint['date'] | null {
  if (!isRecord(value)) {
    return null;
  }

  const year = readInteger(value, 'year');
  const month = readInteger(value, 'month');
  const day = readInteger(value, 'day');

  if (year === null || month === null || day === null) {
    return null;
  }

  return { year, month, day };
}

function parseTimeRecord(value: unknown): CalendarPoint['time'] | undefined | null {
  if (typeof value === 'undefined') {
    return undefined;
  }

  if (!isRecord(value)) {
    return null;
  }

  const hour = readInteger(value, 'hour');
  const minute = readInteger(value, 'minute');

  if (hour === null || minute === null) {
    return null;
  }

  return { hour, minute };
}

export const parseStructuredCalendarPoint: CalendarTimeParser = value => {
  if (!isRecord(value)) {
    return null;
  }

  const date = 'date' in value
    ? parseDateRecord(value.date)
    : parseDateRecord(value);

  if (!date) {
    return null;
  }

  const time = parseTimeRecord(value.time);
  if (time === null) {
    return null;
  }

  return {
    date,
    ...(time ? { time } : {}),
  };
};

export interface SillyTavernMessageTimeSourceOptions {
  reader: SillyTavernMessageVariableReader;
  path: string | readonly string[];
  parser?: CalendarTimeParser;
}

export class SillyTavernMessageTimeSource implements CalendarTimeSource {
  private readonly reader: SillyTavernMessageVariableReader;
  private readonly path: string | readonly string[];
  private readonly parser: CalendarTimeParser;

  constructor(options: SillyTavernMessageTimeSourceOptions) {
    this.reader = options.reader;
    this.path = options.path;
    this.parser = options.parser ?? parseStructuredCalendarPoint;
  }

  getCurrentPoint(): CalendarPoint {
    const variables = this.reader.readLatest();
    const raw = readValueAtPath(variables, this.path);
    const point = this.parser(raw);

    if (!point) {
      const pathLabel = Array.isArray(this.path)
        ? this.path.join('.')
        : this.path;

      throw new Error(
        `Unable to parse current calendar time at message variable path "${pathLabel}"`,
      );
    }

    return point;
  }
}
