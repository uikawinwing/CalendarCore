import type {
  FestivalDefinition,
  FestivalMonthDay,
  FestivalStageDefinition,
} from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const text = value.trim();
  return text ? text : null;
}

function readPositiveInteger(value: unknown): number | null {
  return Number.isInteger(value) && Number(value) > 0
    ? Number(value)
    : null;
}

function readStringArray(value: unknown): string[] | null {
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

function parseMonthDay(value: unknown): FestivalMonthDay | null {
  if (!isRecord(value)) {
    return null;
  }

  const month = readPositiveInteger(value.month);
  const day = readPositiveInteger(value.day);

  return month && day ? { month, day } : null;
}

function parseStage(value: unknown): FestivalStageDefinition | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readNonEmptyString(value.id);
  const title = readNonEmptyString(value.title);
  const start = parseMonthDay(value.start);

  if (!id || !title || !start) {
    return null;
  }

  const output: FestivalStageDefinition = {
    id,
    title,
    start,
  };

  if ('end' in value && typeof value.end !== 'undefined') {
    const end = parseMonthDay(value.end);
    if (!end) {
      return null;
    }
    output.end = end;
  }

  if ('anchorYear' in value && typeof value.anchorYear !== 'undefined') {
    const anchorYear = readPositiveInteger(value.anchorYear);
    if (!anchorYear) {
      return null;
    }
    output.anchorYear = anchorYear;
  }

  if ('repeatEveryYears' in value) {
    if (value.repeatEveryYears === null) {
      output.repeatEveryYears = null;
    } else {
      const repeatEveryYears = readPositiveInteger(value.repeatEveryYears);
      if (!repeatEveryYears) {
        return null;
      }
      output.repeatEveryYears = repeatEveryYears;
    }
  }

  if ('summary' in value && typeof value.summary !== 'undefined') {
    const summary = readNonEmptyString(value.summary);
    if (!summary) {
      return null;
    }
    output.summary = summary;
  }

  if ('metadata' in value && typeof value.metadata !== 'undefined') {
    if (!isRecord(value.metadata)) {
      return null;
    }
    output.metadata = { ...value.metadata };
  }

  return output;
}

function parseDefinition(value: unknown): FestivalDefinition | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readNonEmptyString(value.id);
  const title = readNonEmptyString(value.title);
  const start = parseMonthDay(value.start);
  const anchorYear = readPositiveInteger(value.anchorYear);

  if (!id || !title || !start || !anchorYear) {
    return null;
  }

  let repeatEveryYears: number | null = 1;
  if ('repeatEveryYears' in value) {
    if (value.repeatEveryYears === null) {
      repeatEveryYears = null;
    } else {
      const parsed = readPositiveInteger(value.repeatEveryYears);
      if (!parsed) {
        return null;
      }
      repeatEveryYears = parsed;
    }
  }

  const output: FestivalDefinition = {
    id,
    title,
    start,
    anchorYear,
    repeatEveryYears,
  };

  if ('end' in value && typeof value.end !== 'undefined') {
    const end = parseMonthDay(value.end);
    if (!end) {
      return null;
    }
    output.end = end;
  }

  if ('summary' in value && typeof value.summary !== 'undefined') {
    const summary = readNonEmptyString(value.summary);
    if (!summary) {
      return null;
    }
    output.summary = summary;
  }

  for (const key of ['tags', 'relatedBookIds', 'locationKeywords'] as const) {
    if (key in value && typeof value[key] !== 'undefined') {
      const parsed = readStringArray(value[key]);
      if (!parsed) {
        return null;
      }
      output[key] = parsed;
    }
  }

  if ('metadata' in value && typeof value.metadata !== 'undefined') {
    if (!isRecord(value.metadata)) {
      return null;
    }
    output.metadata = { ...value.metadata };
  }

  if ('stages' in value && typeof value.stages !== 'undefined') {
    if (!Array.isArray(value.stages)) {
      return null;
    }

    const stages: FestivalStageDefinition[] = [];
    for (const stageValue of value.stages) {
      const stage = parseStage(stageValue);
      if (!stage) {
        return null;
      }
      stages.push(stage);
    }

    output.stages = stages;
  }

  return output;
}

export function parseFestivalDefinitions(
  value: unknown,
): FestivalDefinition[] | null {
  if (value === null || typeof value === 'undefined') {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const output: FestivalDefinition[] = [];
  for (const item of value) {
    const parsed = parseDefinition(item);
    if (!parsed) {
      return null;
    }
    output.push(parsed);
  }

  return output;
}
