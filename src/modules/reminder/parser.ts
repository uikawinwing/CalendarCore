import type {
  ReminderDefinition,
  ReminderTarget,
} from './types';
import {
  isRecord,
  parseCalendarPoint,
  parseCalendarRecurrence,
  readMetadata,
  readNonEmptyString,
  readStringArray,
} from '../shared/runtime-parser';

function parseReminderTarget(
  value: unknown,
): ReminderTarget | null {
  if (!isRecord(value)) {
    return null;
  }

  const moduleId = readNonEmptyString(value.moduleId);
  const eventId = readNonEmptyString(value.eventId);

  return moduleId && eventId
    ? { moduleId, eventId }
    : null;
}

function parseReminderDefinition(
  value: unknown,
): ReminderDefinition | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readNonEmptyString(value.id);
  const title = readNonEmptyString(value.title);
  const at = parseCalendarPoint(value.at);

  if (!id || !title || !at) {
    return null;
  }

  const output: ReminderDefinition = {
    id,
    title,
    at,
  };

  if ('recurrence' in value && typeof value.recurrence !== 'undefined') {
    const recurrence = parseCalendarRecurrence(value.recurrence);
    if (!recurrence) {
      return null;
    }
    output.recurrence = recurrence;
  }

  if ('message' in value && typeof value.message !== 'undefined') {
    const message = readNonEmptyString(value.message);
    if (!message) {
      return null;
    }
    output.message = message;
  }

  if ('target' in value && typeof value.target !== 'undefined') {
    const target = parseReminderTarget(value.target);
    if (!target) {
      return null;
    }
    output.target = target;
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

export function parseReminderDefinitions(
  value: unknown,
): ReminderDefinition[] | null {
  if (value === null || typeof value === 'undefined') {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const output: ReminderDefinition[] = [];
  for (const item of value) {
    const parsed = parseReminderDefinition(item);
    if (!parsed) {
      return null;
    }
    output.push(parsed);
  }

  return output;
}
