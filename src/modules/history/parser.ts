import type { HistoryDefinition } from './types';
import { parseModuleEventReference } from '../shared/event-reference';
import {
  isRecord,
  parseCalendarPoint,
  readMetadata,
  readNonEmptyString,
  readStringArray,
} from '../shared/runtime-parser';

function parseHistoryDefinition(
  value: unknown,
): HistoryDefinition | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readNonEmptyString(value.id);
  const title = readNonEmptyString(value.title);
  const occurredAt = parseCalendarPoint(value.occurredAt);

  if (!id || !title || !occurredAt) {
    return null;
  }

  const output: HistoryDefinition = {
    id,
    title,
    occurredAt,
  };

  if ('source' in value && typeof value.source !== 'undefined') {
    const source = parseModuleEventReference(value.source);
    if (!source) {
      return null;
    }
    output.source = source;
  }

  for (const key of ['outcome', 'notes'] as const) {
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

export function parseHistoryDefinitions(
  value: unknown,
): HistoryDefinition[] | null {
  if (value === null || typeof value === 'undefined') {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const output: HistoryDefinition[] = [];
  for (const item of value) {
    const parsed = parseHistoryDefinition(item);
    if (!parsed) {
      return null;
    }
    output.push(parsed);
  }

  return output;
}
