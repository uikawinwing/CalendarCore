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

test('month session loads, selects and navigates without Vue owning app logic', async () => {
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

  model = await session.navigateMonths(1);
  assert.equal(model.year, 2026);
  assert.equal(model.month, 10);
  assert.equal(model.selectedDay, undefined);
});

test('Vue month renderer emits generic selected-day details', async () => {
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

  assert.match(html, /2026 \/ 9/);
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
  assert.match(html, /All day/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /Previous month/);
  assert.match(html, /Next month/);
});
