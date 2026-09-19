import type {
  CalendarDate,
  CalendarDateRange,
  CalendarOccurrence,
} from '../core';

export interface CalendarMonthCell {
  key: string;
  date: CalendarDate;
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
