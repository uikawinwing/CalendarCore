import type {
  CalendarEvent,
  CalendarModuleAdapter,
} from '../../core';
import type { ClassDefinition } from './types';

export const classAdapter: CalendarModuleAdapter<ClassDefinition> = {
  moduleId: 'class',

  normalize(input): CalendarEvent {
    return {
      id: input.id,
      moduleId: this.moduleId,
      kind: 'class',
      title: input.title,
      start: input.start,
      ...(input.end ? { end: input.end } : {}),
      allDay: input.allDay ?? !input.start.time,
      ...(input.recurrence
        ? { recurrence: input.recurrence }
        : {}),
      tags: [...(input.tags ?? [])],
      payload: {
        courseId: input.courseId ?? '',
        instructor: input.instructor ?? '',
        location: input.location ?? '',
        notes: input.notes ?? '',
        metadata: input.metadata ?? {},
      },
    };
  },
};
