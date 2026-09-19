import type { CalendarAppSnapshot } from '../app';
import {
  addCalendarDays,
  assertValidCalendarDate,
  compareCalendarDate,
  enumerateCalendarDateRange,
  formatCalendarDateKey,
  getCalendarWeekday,
  gregorianCalendarSystem,
  isSameCalendarDate,
  type CalendarDate,
  type CalendarDateRange,
  type CalendarSystem,
  type CalendarWeekAnchor,
} from '../core';
import { buildCalendarDayViewModel } from './day-detail';
import type {
  CalendarMonthCell,
  CalendarMonthViewModel,
} from './types';

export interface CalendarMonthGridOptions {
  year: number;
  month: number;
  weekAnchor: CalendarWeekAnchor;
  weekStartsOn?: number;
  calendarSystem?: CalendarSystem;
}

function normalizeWeekStartsOn(
  value: number | undefined,
  system: CalendarSystem,
): number {
  const weekStartsOn = value ?? 0;

  if (
    !Number.isInteger(weekStartsOn) ||
    weekStartsOn < 0 ||
    weekStartsOn >= system.daysInWeek
  ) {
    throw new RangeError(
      `weekStartsOn must be between 0 and ${system.daysInWeek - 1}`,
    );
  }

  return weekStartsOn;
}

export function getCalendarMonthGridRange(
  options: CalendarMonthGridOptions,
): CalendarDateRange {
  const system = options.calendarSystem ?? gregorianCalendarSystem;
  const weekStartsOn = normalizeWeekStartsOn(options.weekStartsOn, system);
  const startOfMonth: CalendarDate = {
    year: options.year,
    month: options.month,
    day: 1,
  };

  assertValidCalendarDate(startOfMonth, system);

  const endOfMonth: CalendarDate = {
    year: options.year,
    month: options.month,
    day: system.daysInMonth(options.year, options.month),
  };

  const startWeekday = getCalendarWeekday(
    startOfMonth,
    options.weekAnchor,
    system,
  );
  const startPadding =
    (startWeekday - weekStartsOn + system.daysInWeek) %
    system.daysInWeek;

  const weekEndsOn =
    (weekStartsOn + system.daysInWeek - 1) %
    system.daysInWeek;
  const endWeekday = getCalendarWeekday(
    endOfMonth,
    options.weekAnchor,
    system,
  );
  const endPadding =
    (weekEndsOn - endWeekday + system.daysInWeek) %
    system.daysInWeek;

  return {
    start: addCalendarDays(startOfMonth, -startPadding, system),
    end: addCalendarDays(endOfMonth, endPadding, system),
  };
}

export interface BuildCalendarMonthViewModelOptions
  extends CalendarMonthGridOptions {
  snapshot: CalendarAppSnapshot;
  selectedDate?: CalendarDate;
}

function snapshotCoversRange(
  snapshotRange: CalendarDateRange,
  targetRange: CalendarDateRange,
): boolean {
  return (
    compareCalendarDate(snapshotRange.start, targetRange.start) <= 0 &&
    compareCalendarDate(snapshotRange.end, targetRange.end) >= 0
  );
}

export function buildCalendarMonthViewModel(
  options: BuildCalendarMonthViewModelOptions,
): CalendarMonthViewModel {
  const system = options.calendarSystem ?? gregorianCalendarSystem;
  const range = getCalendarMonthGridRange(options);

  if (!snapshotCoversRange(options.snapshot.range, range)) {
    throw new RangeError(
      'CalendarAppSnapshot does not cover the complete month grid range',
    );
  }

  const occurrencesByDate = new Map(
    options.snapshot.days.map(day => [
      formatCalendarDateKey(day.date),
      day.occurrences,
    ]),
  );

  const cells: CalendarMonthCell[] =
    enumerateCalendarDateRange(range, system).map(date => {
      const key = formatCalendarDateKey(date);

      return {
        key,
        date,
        weekday: getCalendarWeekday(
          date,
          options.weekAnchor,
          system,
        ),
        inCurrentMonth:
          date.year === options.year &&
          date.month === options.month,
        isToday: isSameCalendarDate(
          date,
          options.snapshot.now.date,
        ),
        isSelected: options.selectedDate
          ? isSameCalendarDate(date, options.selectedDate)
          : false,
        occurrences: occurrencesByDate.get(key) ?? [],
      };
    });

  const selectedCell = cells.find(cell => cell.isSelected);
  const selectedDay = selectedCell
    ? buildCalendarDayViewModel(
        selectedCell.date,
        selectedCell.occurrences,
        selectedCell.isToday,
      )
    : undefined;

  return {
    year: options.year,
    month: options.month,
    columns: system.daysInWeek,
    range,
    cells,
    ...(selectedDay ? { selectedDay } : {}),
  };
}
