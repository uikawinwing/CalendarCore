import type { CalendarApp, CalendarAppSnapshot } from '../app';
import {
  addCalendarDays,
  addCalendarMonths,
  assertValidCalendarDate,
  cloneCalendarDate,
  gregorianCalendarSystem,
  type CalendarDate,
  type CalendarSystem,
  type CalendarWeekAnchor,
} from '../core';
import {
  buildCalendarMonthViewModel,
  getCalendarMonthGridRange,
} from './month-grid';
import type { CalendarMonthViewModel } from './types';

export interface CalendarMonthSessionOptions {
  app: CalendarApp;
  initialMonth: Pick<CalendarDate, 'year' | 'month'>;
  weekAnchor: CalendarWeekAnchor;
  weekStartsOn?: number;
  calendarSystem?: CalendarSystem;
  selectedDate?: CalendarDate;
}

export class CalendarMonthSession {
  private readonly app: CalendarApp;
  private readonly weekAnchor: CalendarWeekAnchor;
  private readonly weekStartsOn: number | undefined;
  private readonly calendarSystem: CalendarSystem;

  private currentMonth: Pick<CalendarDate, 'year' | 'month'>;
  private selectedDate: CalendarDate | undefined;
  private snapshot: CalendarAppSnapshot | null = null;
  private model: CalendarMonthViewModel | null = null;

  constructor(options: CalendarMonthSessionOptions) {
    this.app = options.app;
    this.weekAnchor = options.weekAnchor;
    this.weekStartsOn = options.weekStartsOn;
    this.calendarSystem =
      options.calendarSystem ?? gregorianCalendarSystem;

    const firstDay = {
      ...options.initialMonth,
      day: 1,
    };
    assertValidCalendarDate(firstDay, this.calendarSystem);

    this.currentMonth = {
      year: firstDay.year,
      month: firstDay.month,
    };

    if (options.selectedDate) {
      assertValidCalendarDate(
        options.selectedDate,
        this.calendarSystem,
      );
      this.selectedDate = cloneCalendarDate(
        options.selectedDate,
      );
    }
  }

  getCurrentMonth(): Pick<CalendarDate, 'year' | 'month'> {
    return { ...this.currentMonth };
  }

  getSelectedDate(): CalendarDate | undefined {
    return this.selectedDate
      ? cloneCalendarDate(this.selectedDate)
      : undefined;
  }

  getModel(): CalendarMonthViewModel | null {
    return this.model;
  }

  async load(): Promise<CalendarMonthViewModel> {
    const range = getCalendarMonthGridRange({
      ...this.currentMonth,
      weekAnchor: this.weekAnchor,
      weekStartsOn: this.weekStartsOn,
      calendarSystem: this.calendarSystem,
    });

    this.snapshot = await this.app.buildSnapshot(range);
    this.model = this.buildModel(this.snapshot);
    return this.model;
  }

  async navigateMonths(
    delta: number,
  ): Promise<CalendarMonthViewModel> {
    const next = addCalendarMonths(
      {
        ...this.currentMonth,
        day: 1,
      },
      delta,
      this.calendarSystem,
    );

    this.currentMonth = {
      year: next.year,
      month: next.month,
    };

    // Keep the agenda visible on the corresponding day in the next month.
    if (this.selectedDate) {
      this.selectedDate = {
        ...this.currentMonth,
        day: Math.min(
          this.selectedDate.day,
          this.calendarSystem.daysInMonth(next.year, next.month),
        ),
      };
    }

    return this.load();
  }

  async goToDate(date: CalendarDate): Promise<CalendarMonthViewModel> {
    assertValidCalendarDate(date, this.calendarSystem);
    this.selectedDate = cloneCalendarDate(date);
    if (
      !this.snapshot ||
      date.year !== this.currentMonth.year ||
      date.month !== this.currentMonth.month
    ) {
      this.currentMonth = { year: date.year, month: date.month };
      return this.load();
    }
    this.model = this.buildModel(this.snapshot);
    return this.model;
  }

  async stepSelectedDate(delta: number): Promise<CalendarMonthViewModel> {
    const base = this.selectedDate ?? this.model?.today;
    if (!base) {
      throw new Error('CalendarMonthSession must be loaded before stepping dates');
    }
    return this.goToDate(addCalendarDays(base, delta, this.calendarSystem));
  }

  selectDate(date: CalendarDate): CalendarMonthViewModel {
    assertValidCalendarDate(date, this.calendarSystem);

    if (!this.snapshot) {
      throw new Error(
        'CalendarMonthSession must be loaded before selecting a date',
      );
    }

    this.selectedDate = cloneCalendarDate(date);
    this.model = this.buildModel(this.snapshot);
    return this.model;
  }

  clearSelectedDate(): CalendarMonthViewModel {
    if (!this.snapshot) {
      throw new Error(
        'CalendarMonthSession must be loaded before clearing selection',
      );
    }

    this.selectedDate = undefined;
    this.model = this.buildModel(this.snapshot);
    return this.model;
  }

  private buildModel(
    snapshot: CalendarAppSnapshot,
  ): CalendarMonthViewModel {
    return buildCalendarMonthViewModel({
      ...this.currentMonth,
      weekAnchor: this.weekAnchor,
      weekStartsOn: this.weekStartsOn,
      calendarSystem: this.calendarSystem,
      selectedDate: this.selectedDate,
      snapshot,
    });
  }
}
