import type {
  CalendarEvent,
  CalendarModuleAdapter,
} from '../../core';
import type { BirthdayDefinition } from './types';

export const birthdayAdapter: CalendarModuleAdapter<BirthdayDefinition> = {
  moduleId: 'birthday',

  normalize(input): CalendarEvent {
    return {
      id: input.id,
      moduleId: this.moduleId,
      kind: 'birthday',
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
        subject: input.subject ?? '',
        notes: input.notes ?? '',
        originDate: { ...input.date },
        metadata: input.metadata ?? {},
      },
    };
  },
};
