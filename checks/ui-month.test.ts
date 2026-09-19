import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CalendarApp,
  buildCalendarMonthViewModel,
  getCalendarMonthGridRange,
  type CalendarModuleAdapter,
  type CalendarWeekAnchor,
} from '../src/index';

interface AppointmentInput {
  id: string;
  title: string;
  year: number;
  month: number;
  day: number;
}

const appointmentAdapter: CalendarModuleAdapter<AppointmentInput> = {
  moduleId: 'appointment',

  normalize(input) {
    return {
      id: input.id,
      moduleId: this.moduleId,
      kind: 'appointment',
      title: input.title,
      start: {
        date: {
          year: input.year,
          month: input.month,
          day: input.day,
        },
      },
      allDay: true,
    };
  },
};

test('month grid includes leading and trailing week cells without UI-specific event rules', async () => {
  const weekAnchor: CalendarWeekAnchor = {
    date: { year: 100, month: 2, day: 1 },
    weekday: 2,
  };

  const range = getCalendarMonthGridRange({
    year: 100,
    month: 2,
    weekAnchor,
  });

  assert.deepEqual(range, {
    start: { year: 100, month: 1, day: 30 },
    end: { year: 100, month: 3, day: 5 },
  });

  const app = new CalendarApp({
    timeSource: {
      getCurrentPoint: () => ({
        date: { year: 100, month: 2, day: 3 },
      }),
    },
  });

  app.registerModule({
    adapter: appointmentAdapter,
    source: {
      load: () => [
        {
          id: 'meeting',
          title: 'Meeting',
          year: 100,
          month: 2,
          day: 3,
        },
      ],
    },
  });

  const snapshot = await app.buildSnapshot(range);
  const view = buildCalendarMonthViewModel({
    year: 100,
    month: 2,
    weekAnchor,
    selectedDate: { year: 100, month: 2, day: 4 },
    snapshot,
  });

  assert.equal(view.columns, 7);
  assert.equal(view.cells.length, 35);
  assert.deepEqual(view.cells[0]?.date, {
    year: 100,
    month: 1,
    day: 30,
  });
  assert.deepEqual(view.cells.at(-1)?.date, {
    year: 100,
    month: 3,
    day: 5,
  });
  assert.equal(
    view.cells.filter(cell => cell.inCurrentMonth).length,
    28,
  );

  const today = view.cells.find(cell => cell.isToday);
  assert.deepEqual(today?.date, {
    year: 100,
    month: 2,
    day: 3,
  });
  assert.deepEqual(
    today?.occurrences.map(value => value.event.id),
    ['meeting'],
  );

  const selected = view.cells.find(cell => cell.isSelected);
  assert.deepEqual(selected?.date, {
    year: 100,
    month: 2,
    day: 4,
  });
});

test('month grid respects custom week lengths', () => {
  const fiveDayCalendar = {
    id: 'five-day-calendar',
    daysInWeek: 5,
    monthsInYear: () => 4,
    daysInMonth: () => 20,
  };

  const weekAnchor: CalendarWeekAnchor = {
    date: { year: 1, month: 1, day: 1 },
    weekday: 0,
  };

  const range = getCalendarMonthGridRange({
    year: 1,
    month: 2,
    weekAnchor,
    calendarSystem: fiveDayCalendar,
  });

  assert.deepEqual(range, {
    start: { year: 1, month: 2, day: 1 },
    end: { year: 1, month: 2, day: 20 },
  });
});
