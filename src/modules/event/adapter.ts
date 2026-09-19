import type {
  CalendarEvent,
  CalendarModuleAdapter,
} from '../../core';
import type { EventDefinition } from './types';

export const eventAdapter: CalendarModuleAdapter<EventDefinition> = {
  moduleId: 'event',

  normalize(input): CalendarEvent {
    return {
      id: input.id,
      moduleId: this.moduleId,
      kind: 'event',
      title: input.title,
      start: input.start,
      ...(input.end ? { end: input.end } : {}),
      allDay: input.allDay ?? !input.start.time,
      ...(input.recurrence
        ? { recurrence: input.recurrence }
        : {}),
      tags: [...(input.tags ?? [])],
      payload: {
        summary: input.summary ?? '',
        metadata: input.metadata ?? {},
      },
    };
  },
};
