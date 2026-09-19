import {
  isRecord,
  readNonEmptyString,
} from './runtime-parser';

export interface ModuleEventReference {
  moduleId: string;
  eventId: string;
}

export function parseModuleEventReference(
  value: unknown,
): ModuleEventReference | null {
  if (!isRecord(value)) {
    return null;
  }

  const moduleId = readNonEmptyString(value.moduleId);
  const eventId = readNonEmptyString(value.eventId);

  return moduleId && eventId
    ? { moduleId, eventId }
    : null;
}
