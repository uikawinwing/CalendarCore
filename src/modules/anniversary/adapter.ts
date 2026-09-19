import type {
  CalendarEvent,
  CalendarModuleAdapter,
} from '../../core';
import type { AnniversaryDefinition } from './types';

export const anniversaryAdapter: CalendarModuleAdapter<AnniversaryDefinition> = {
  moduleId: 'anniversary',

  normalize(input): CalendarEvent {
    return {
      id: input.id,
      moduleId: this.moduleId,
      kind: 'anniversary',
      title: input.title,
      start: {
        date: { ...input.date },
      },
      allDay: true,
      recurrence: {
        frequency: 'yearly',
      },
      tags: [...(input.tags ?? [])],
      payload: {
        category: input.category ?? '',
        notes: input.notes ?? '',
        originDate: { ...input.date },
        metadata: input.metadata ?? {},
      },
    };
  },
};
