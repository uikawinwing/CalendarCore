import type {
  CalendarEvent,
  CalendarModuleAdapter,
} from '../../core';
import type { ReminderDefinition } from './types';

export const reminderAdapter: CalendarModuleAdapter<ReminderDefinition> = {
  moduleId: 'reminder',

  normalize(input): CalendarEvent {
    return {
      id: input.id,
      moduleId: this.moduleId,
      kind: 'reminder',
      title: input.title,
      start: input.at,
      allDay: !input.at.time,
      ...(input.recurrence
        ? { recurrence: input.recurrence }
        : {}),
      tags: [...(input.tags ?? [])],
      payload: {
        message: input.message ?? '',
        target: input.target
          ? { ...input.target }
          : null,
        metadata: input.metadata ?? {},
      },
    };
  },
};
