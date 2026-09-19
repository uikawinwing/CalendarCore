import type {
  CalendarPoint,
  CalendarRecurrence,
} from '../../core';

export interface AppointmentDefinition {
  id: string;
  title: string;
  start: CalendarPoint;
  end?: CalendarPoint;
  allDay?: boolean;
  recurrence?: CalendarRecurrence;
  location?: string;
  attendees?: string[];
  notes?: string;
  tags?: string[];
  metadata?: Readonly<Record<string, unknown>>;
}
