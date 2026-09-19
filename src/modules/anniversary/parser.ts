import type { AnniversaryDefinition } from './types';
import {
  isRecord,
  parseCalendarDate,
  readMetadata,
  readNonEmptyString,
  readStringArray,
} from '../shared/runtime-parser';

function parseAnniversaryDefinition(
  value: unknown,
): AnniversaryDefinition | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readNonEmptyString(value.id);
  const title = readNonEmptyString(value.title);
  const date = parseCalendarDate(value.date);

  if (!id || !title || !date) {
    return null;
  }

  const output: AnniversaryDefinition = {
    id,
    title,
    date,
  };

  for (const key of ['category', 'notes'] as const) {
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

export function parseAnniversaryDefinitions(
  value: unknown,
): AnniversaryDefinition[] | null {
  if (value === null || typeof value === 'undefined') {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const output: AnniversaryDefinition[] = [];
  for (const item of value) {
    const parsed = parseAnniversaryDefinition(item);
    if (!parsed) {
      return null;
    }
    output.push(parsed);
  }

  return output;
}
