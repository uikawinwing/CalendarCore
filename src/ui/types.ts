import type {
  CalendarDate as CoreCalendarDate,
  CalendarDateRange,
  CalendarOccurrence,
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

export interface CalendarMonthViewModel {
  year: number;
  month: number;
  columns: number;
  range: CalendarDateRange;
  cells: CalendarMonthCell[];
}
