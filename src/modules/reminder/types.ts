import type {
  CalendarPoint,
  CalendarRecurrence,
} from '../../core';

export interface ReminderTarget {
  moduleId: string;
  eventId: string;
}

export interface ReminderDefinition {
  id: string;
  title: string;
  at: CalendarPoint;
  recurrence?: CalendarRecurrence;
  message?: string;
  target?: ReminderTarget;
  tags?: string[];
  metadata?: Readonly<Record<string, unknown>>;
}
