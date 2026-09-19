import type { CalendarEvent, CalendarModuleAdapter } from './types';

function assertNonEmpty(value: string, field: string): void {
  if (!value.trim()) {
    throw new Error(`CalendarEvent.${field} must not be empty`);
  }
}

function validateEvent(event: CalendarEvent, expectedModuleId: string): CalendarEvent {
  assertNonEmpty(event.id, 'id');
  assertNonEmpty(event.moduleId, 'moduleId');
  assertNonEmpty(event.kind, 'kind');
  assertNonEmpty(event.title, 'title');

  if (event.moduleId !== expectedModuleId) {
    throw new Error(
      `Adapter "${expectedModuleId}" returned event for module "${event.moduleId}"`,
    );
  }

  return event;
}

export class CalendarRegistry {
  private readonly adapters = new Map<string, CalendarModuleAdapter<unknown>>();

  register<TInput>(adapter: CalendarModuleAdapter<TInput>): void {
    assertNonEmpty(adapter.moduleId, 'moduleId');

    if (this.adapters.has(adapter.moduleId)) {
      throw new Error(`Calendar module already registered: ${adapter.moduleId}`);
    }

    this.adapters.set(
      adapter.moduleId,
      adapter as CalendarModuleAdapter<unknown>,
    );
  }

  has(moduleId: string): boolean {
    return this.adapters.has(moduleId);
  }

  normalize<TInput>(moduleId: string, input: TInput): CalendarEvent[] {
    const adapter = this.adapters.get(moduleId);

    if (!adapter) {
      throw new Error(`Calendar module is not registered: ${moduleId}`);
    }

    const result = adapter.normalize(input);
    const events = Array.isArray(result) ? result : [result];

    return events.map(event => validateEvent(event, moduleId));
  }
}
