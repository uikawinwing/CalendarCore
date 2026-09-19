import type { BirthdayDefinition } from './types';
import {
  isRecord,
  parseCalendarDate,
  readMetadata,
  readNonEmptyString,
  readStringArray,
} from '../shared/runtime-parser';

function parseBirthdayDefinition(
  value: unknown,
): BirthdayDefinition | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readNonEmptyString(value.id);
  const title = readNonEmptyString(value.title);
  const date = parseCalendarDate(value.date);

  if (!id || !title || !date) {
    return null;
  }

  const output: BirthdayDefinition = {
    id,
    title,
    date,
  };

  for (const key of ['subject', 'notes'] as const) {
    if (key in value && typeof value[key] !== 'undefined') {
      const text = readNonEmptyString(value[key]);
      if (!text) {
        return null;
      }
      output[key] = text;
    }
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

export function parseBirthdayDefinitions(
  value: unknown,
): BirthdayDefinition[] | null {
  if (value === null || typeof value === 'undefined') {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const output: BirthdayDefinition[] = [];
  for (const item of value) {
    const parsed = parseBirthdayDefinition(item);
    if (!parsed) {
      return null;
    }
    output.push(parsed);
  }

  return output;
}
