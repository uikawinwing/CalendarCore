import type {
  CalendarPoint,
  CalendarRecurrence,
} from '../../core';
import type { ModuleEventReference } from '../shared/event-reference';

export type ReminderTarget = ModuleEventReference;

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
