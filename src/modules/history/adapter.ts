import type {
  CalendarEvent,
  CalendarModuleAdapter,
} from '../../core';
import type { HistoryDefinition } from './types';

export const historyAdapter: CalendarModuleAdapter<HistoryDefinition> = {
  moduleId: 'history',

  normalize(input): CalendarEvent {
    return {
      id: input.id,
      moduleId: this.moduleId,
      kind: 'history',
      title: input.title,
      start: input.occurredAt,
      allDay: !input.occurredAt.time,
      tags: [...(input.tags ?? [])],
      payload: {
        source: input.source
          ? { ...input.source }
          : null,
        outcome: input.outcome ?? '',
        notes: input.notes ?? '',
        metadata: input.metadata ?? {},
      },
    };
  },
};
