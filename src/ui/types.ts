import type {
  CalendarDate as CoreCalendarDate,
  CalendarDateRange,
  CalendarOccurrence,
  CalendarPoint,
} from '../core';

export type { CalendarDate } from '../core';

export interface CalendarMonthCell {
  key: string;
  date: CoreCalendarDate;
  weekday: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  occurrences: CalendarOccurrence[];
}

export interface CalendarDayOccurrenceView {
  key: string;
  eventId: string;
  occurrenceIndex: number;
  moduleId: string;
  kind: string;
  title: string;
  allDay: boolean;
  start: CalendarPoint;
  end?: CalendarPoint;
  tags: string[];
}

export interface CalendarDayViewModel {
  key: string;
  date: CoreCalendarDate;
  isToday: boolean;
  occurrences: CalendarDayOccurrenceView[];
}

export interface CalendarMonthViewModel {
  year: number;
  month: number;
  columns: number;
  range: CalendarDateRange;
  cells: CalendarMonthCell[];
  selectedDay?: CalendarDayViewModel;
}
