export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

export interface CalendarDateRange {
  start: CalendarDate;
  end: CalendarDate;
}

export interface CalendarWeekAnchor {
  date: CalendarDate;
  weekday: number;
}

export interface CalendarClock {
  hour: number;
  minute: number;
}

export interface CalendarPoint {
  date: CalendarDate;
  time?: CalendarClock;
}

export type CalendarRecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface CalendarRecurrence {
  frequency: CalendarRecurrenceFrequency;
  interval?: number;
  until?: CalendarDate;
}

export interface CalendarEvent {
  id: string;
  moduleId: string;
  kind: string;
  title: string;
  start: CalendarPoint;
  end?: CalendarPoint;
  allDay?: boolean;
  recurrence?: CalendarRecurrence;
  tags?: string[];
  payload?: Readonly<Record<string, unknown>>;
}

export interface CalendarOccurrence {
  event: CalendarEvent;
  occurrenceIndex: number;
  start: CalendarPoint;
  end?: CalendarPoint;
}

export interface CalendarDayProjection {
  date: CalendarDate;
  occurrences: CalendarOccurrence[];
}

export interface CalendarModuleAdapter<TInput> {
  readonly moduleId: string;
  normalize(input: TInput): CalendarEvent | CalendarEvent[];
}
