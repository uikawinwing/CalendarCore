import type {
  SillyTavernMessageVariableTarget,
  SillyTavernRuntime,
} from './runtime';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export class SillyTavernMessageVariableReader {
  constructor(private readonly runtime: SillyTavernRuntime) {}

  readLatest(): Record<string, unknown> {
    const messageId = this.runtime.getLastMessageId();

    if (!Number.isInteger(messageId) || messageId < 0) {
      throw new Error(
        `SillyTavern returned an invalid latest message id: ${String(messageId)}`,
      );
    }

    const target: SillyTavernMessageVariableTarget = {
      type: 'message',
      message_id: messageId,
    };

    if (this.runtime.getMvuData) {
      try {
        const mvuData = this.runtime.getMvuData(target);
        if (isRecord(mvuData)) {
          return mvuData;
        }
      } catch {
        // MVU is optional. Fall back to normal message variables.
      }
    }

    const variables = this.runtime.getVariables(target);
    if (!isRecord(variables)) {
      throw new Error('SillyTavern message variables are not an object');
    }

    return variables;
  }
}

export function readValueAtPath(
  value: unknown,
  path: string | readonly string[],
): unknown {
  const segments =
    typeof path === 'string'
      ? path.split('.').map(segment => segment.trim()).filter(Boolean)
      : [...path];

  let cursor: unknown = value;

  for (const segment of segments) {
    if (!isRecord(cursor) || !(segment in cursor)) {
      return undefined;
    }
    cursor = cursor[segment];
  }

  return cursor;
}
