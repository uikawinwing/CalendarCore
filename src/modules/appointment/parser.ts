import type { AppointmentDefinition } from './types';
import {
  isRecord,
  parseCalendarPoint,
  parseCalendarRecurrence,
  readBoolean,
  readMetadata,
  readNonEmptyString,
  readStringArray,
} from '../shared/runtime-parser';

function parseAppointmentDefinition(
  value: unknown,
): AppointmentDefinition | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readNonEmptyString(value.id);
  const title = readNonEmptyString(value.title);
  const start = parseCalendarPoint(value.start);

  if (!id || !title || !start) {
    return null;
  }

  const output: AppointmentDefinition = {
    id,
    title,
    start,
  };

  if ('end' in value && typeof value.end !== 'undefined') {
    const end = parseCalendarPoint(value.end);
    if (!end) {
      return null;
    }
    output.end = end;
  }

  if ('allDay' in value && typeof value.allDay !== 'undefined') {
    const allDay = readBoolean(value.allDay);
    if (allDay === null) {
      return null;
    }
    output.allDay = allDay;
  }

  if ('recurrence' in value && typeof value.recurrence !== 'undefined') {
    const recurrence = parseCalendarRecurrence(value.recurrence);
    if (!recurrence) {
      return null;
    }
    output.recurrence = recurrence;
  }

  for (const key of ['location', 'notes'] as const) {
    if (key in value && typeof value[key] !== 'undefined') {
      const text = readNonEmptyString(value[key]);
      if (!text) {
        return null;
      }
      output[key] = text;
    }
  }

  if ('attendees' in value && typeof value.attendees !== 'undefined') {
    const attendees = readStringArray(value.attendees);
    if (!attendees) {
      return null;
    }
    output.attendees = attendees;
  }

  if ('tags' in value && typeof value.tags !== 'undefined') {
    const tags = readStringArray(value.tags);
    if (!tags) {
      return null;
    }
    output.tags = tags;
  }

  if ('metadata' in value && typeof value.metadata !== 'undefined') {
    const metadata = readMetadata(value.metadata);
    if (!metadata) {
      return null;
    }
    output.metadata = metadata;
  }

  return output;
}

export function parseAppointmentDefinitions(
  value: unknown,
): AppointmentDefinition[] | null {
  if (value === null || typeof value === 'undefined') {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const output: AppointmentDefinition[] = [];
  for (const item of value) {
    const parsed = parseAppointmentDefinition(item);
    if (!parsed) {
      return null;
    }
    output.push(parsed);
  }

  return output;
}
