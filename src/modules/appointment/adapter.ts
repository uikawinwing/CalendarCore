import type {
  CalendarEvent,
  CalendarModuleAdapter,
} from '../../core';
import type { AppointmentDefinition } from './types';

export const appointmentAdapter: CalendarModuleAdapter<AppointmentDefinition> = {
  moduleId: 'appointment',

  normalize(input): CalendarEvent {
    return {
      id: input.id,
      moduleId: this.moduleId,
      kind: 'appointment',
      title: input.title,
      start: input.start,
      ...(input.end ? { end: input.end } : {}),
      allDay: input.allDay ?? !input.start.time,
      ...(input.recurrence
        ? { recurrence: input.recurrence }
        : {}),
      tags: [...(input.tags ?? [])],
      payload: {
        location: input.location ?? '',
        attendees: [...(input.attendees ?? [])],
        notes: input.notes ?? '',
        metadata: input.metadata ?? {},
      },
    };
  },
};
