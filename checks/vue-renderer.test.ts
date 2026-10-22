import assert from 'node:assert/strict';
import test from 'node:test';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';

import {
  CalendarApp,
  CalendarMonthSession,
  CalendarMonthView,
  type CalendarModuleAdapter,
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

test('month session loads, selects, clears and navigates without Vue owning app logic', async () => {
  const app = new CalendarApp({
    timeSource: {
      getCurrentPoint: () => ({
        date: { year: 2026, month: 9, day: 19 },
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
          year: 2026,
          month: 9,
          day: 19,
        },
      ],
    },
  });

  const session = new CalendarMonthSession({
    app,
    initialMonth: { year: 2026, month: 9 },
    weekAnchor: {
      date: { year: 2026, month: 9, day: 19 },
      weekday: 6,
    },
  });

  let model = await session.load();
  assert.equal(model.year, 2026);
  assert.equal(model.month, 9);

  model = session.selectDate({
    year: 2026,
    month: 9,
    day: 19,
  });
  assert.equal(
    model.cells.find(cell => cell.isSelected)?.key,
    '2026-09-19',
  );
  assert.equal(
    model.selectedDay?.occurrences[0]?.eventId,
    'meeting',
  );

  model = session.clearSelectedDate();
  assert.equal(model.selectedDay, undefined);
  assert.equal(
    model.cells.some(cell => cell.isSelected),
    false,
  );

  model = await session.navigateMonths(1);
  assert.equal(model.year, 2026);
  assert.equal(model.month, 10);
  assert.equal(model.selectedDay, undefined);
});

test('Vue month renderer provides a persistent V3 agenda and compact calendar controls', async () => {
  const app = new CalendarApp({
    timeSource: {
      getCurrentPoint: () => ({
        date: { year: 2026, month: 9, day: 19 },
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
          year: 2026,
          month: 9,
          day: 19,
        },
      ],
    },
  });

  const session = new CalendarMonthSession({
    app,
    initialMonth: { year: 2026, month: 9 },
    weekAnchor: {
      date: { year: 2026, month: 9, day: 19 },
      weekday: 6,
    },
    selectedDate: {
      year: 2026,
      month: 9,
      day: 19,
    },
  });

  const model = await session.load();

  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(CalendarMonthView, {
          model,
          weekdayLabels: [
            '日',
            '一',
            '二',
            '三',
            '四',
            '五',
            '六',
          ],
        }),
    }),
  );

  assert.match(html, /2026 年 9 月/);
  assert.match(
    html,
    /data-calendar-date="2026-09-19"/,
  );
  assert.match(
    html,
    /data-day-detail-date="2026-09-19"/,
  );
  assert.match(
    html,
    /data-detail-event-id="meeting"/,
  );
  assert.match(html, /appointment/);
  assert.match(html, /Meeting/);
  assert.match(html, /全天/);
  assert.match(html, /data-expanded="false"/);
  assert.match(html, /aria-label="日期快捷导航"/);
  assert.match(html, /cc-month-cell--active-week/);
  assert.match(html, /展开月历/);
  assert.match(html, /前一天/);
  assert.match(html, /后一天/);
  assert.doesNotMatch(html, /返回月历/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /Previous month/);
  assert.match(html, /Next month/);
});


test('mobile date navigation crosses months and can return to world today', async () => {
  const app = new CalendarApp({
    timeSource: {
      getCurrentPoint: () => ({ date: { year: 2026, month: 9, day: 30 } }),
    },
  });
  const session = new CalendarMonthSession({
    app,
    initialMonth: { year: 2026, month: 9 },
    weekAnchor: { date: { year: 2026, month: 9, day: 19 }, weekday: 6 },
    selectedDate: { year: 2026, month: 9, day: 30 },
  });
  let model = await session.load();
  assert.deepEqual(model.today, { year: 2026, month: 9, day: 30 });
  model = await session.stepSelectedDate(1);
  assert.equal(model.month, 10);
  assert.equal(model.selectedDay?.date.day, 1);
  model = await session.stepSelectedDate(-1);
  assert.equal(model.month, 9);
  assert.equal(model.selectedDay?.date.day, 30);
  model = await session.goToDate({ year: 2026, month: 12, day: 31 });
  assert.equal(model.month, 12);
  model = await session.goToDate(model.today);
  assert.equal(model.month, 9);
  assert.equal(model.selectedDay?.isToday, true);
});

test('V3 month view keeps eight-day calendar columns and no mobile day overlay', async () => {
  const eightDayCalendar = {
    id: 'eight-day',
    daysInWeek: 8,
    monthsInYear: () => 12,
    daysInMonth: () => 24,
  };
  const app = new CalendarApp({
    timeSource: {
      getCurrentPoint: () => ({ date: { year: 12, month: 2, day: 24 } }),
    },
    calendarSystem: eightDayCalendar,
  });
  const session = new CalendarMonthSession({
    app,
    initialMonth: { year: 12, month: 2 },
    calendarSystem: eightDayCalendar,
    weekAnchor: { date: { year: 12, month: 2, day: 1 }, weekday: 0 },
    selectedDate: { year: 12, month: 2, day: 24 },
  });
  const model = await session.load();
  assert.equal(model.columns, 8);
  const html = await renderToString(createSSRApp({
    render: () => h(CalendarMonthView, {
      model,
      weekdayLabels: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
    }),
  }));
  assert.match(html, /--cc-calendar-columns:8/);
  assert.match(html, /辛/);
  assert.match(html, /24日/);
  assert.match(html, /cc-month-cell--active-week/);
  const next = await session.stepSelectedDate(1);
  assert.equal(next.month, 3);
  assert.equal(next.selectedDay?.date.day, 1);
});
