import type {
  CalendarPoint,
  CalendarRecurrence,
} from '../../core';

export interface EventDefinition {
  id: string;
  title: string;
  start: CalendarPoint;
  end?: CalendarPoint;
  allDay?: boolean;
  recurrence?: CalendarRecurrence;
  summary?: string;
  tags?: string[];
  metadata?: Readonly<Record<string, unknown>>;
}
