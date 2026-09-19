import type {
  CalendarPoint,
  CalendarRecurrence,
} from '../../core';

export interface ClassDefinition {
  id: string;
  title: string;
  start: CalendarPoint;
  end?: CalendarPoint;
  allDay?: boolean;
  recurrence?: CalendarRecurrence;
  courseId?: string;
  instructor?: string;
  location?: string;
  notes?: string;
  tags?: string[];
  metadata?: Readonly<Record<string, unknown>>;
}
