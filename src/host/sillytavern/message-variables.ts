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

    let mvuVariables: Record<string, unknown> | null = null;
    if (this.runtime.getMvuData) {
      try {
        const mvuData = this.runtime.getMvuData(target);
        if (isRecord(mvuData)) {
          mvuVariables = mvuData;
          // Continue reading ordinary variables: they may contain calendar
          // while MVU contains stat_data (or vice versa).
        }
      } catch {
        // MVU is optional. Fall back to normal message variables.
      }
    }

    try {
      const variables = this.runtime.getVariables(target);
      if (isRecord(variables)) {
        // Combine independent top-level schemas rather than discarding a
        // world clock when the other provider only has a partial calendar.
        // MVU takes precedence for keys it actually provides.
        return mvuVariables ? { ...variables, ...mvuVariables } : variables;
      }
    } catch (error) {
      if (mvuVariables) return mvuVariables;
      throw error;
    }

    if (mvuVariables) return mvuVariables;
    throw new Error('SillyTavern message variables are not an object');
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

