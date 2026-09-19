import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CalendarApp,
  festivalAdapter,
  type CalendarModuleAdapter,
  type FestivalDefinition,
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

test('CalendarApp composes module sources into one snapshot', async () => {
  const app = new CalendarApp({
    timeSource: {
      getCurrentPoint() {
        return {
          date: { year: 1002, month: 12, day: 31 },
          time: { hour: 20, minute: 0 },
        };
      },
    },
  });

  const festivals: FestivalDefinition[] = [
    {
      id: 'new-year',
      title: '跨年祭',
      start: { month: 12, day: 30 },
      end: { month: 1, day: 3 },
      anchorYear: 1000,
      repeatEveryYears: 2,
      stages: [
        {
          id: 'eve',
          title: '前夜',
          start: { month: 12, day: 31 },
        },
      ],
    },
  ];

  app.registerModule({
    adapter: festivalAdapter,
    source: {
      load: () => festivals,
    },
  });

  app.registerModule({
    adapter: appointmentAdapter,
    source: {
      load: () => [
        {
          id: 'meeting',
          title: '新年会面',
          year: 1003,
          month: 1,
          day: 1,
        },
      ],
    },
  });

  const snapshot = await app.buildSnapshot({
    start: { year: 1002, month: 12, day: 29 },
    end: { year: 1003, month: 1, day: 4 },
  });

  assert.deepEqual(snapshot.now.date, {
    year: 1002,
    month: 12,
    day: 31,
  });
  assert.equal(snapshot.events.length, 3);
  assert.equal(snapshot.days.length, 7);

  const newYearDay = snapshot.days.find(
    day =>
      day.date.year === 1003 &&
      day.date.month === 1 &&
      day.date.day === 1,
  );

  assert.deepEqual(
    newYearDay?.occurrences.map(value => value.event.id),
    ['new-year', 'meeting'],
  );
});

test('CalendarApp does not load module data before a snapshot is requested', async () => {
  let loads = 0;

  const app = new CalendarApp({
    timeSource: {
      getCurrentPoint: () => ({
        date: { year: 1, month: 1, day: 1 },
      }),
    },
  });

  app.registerModule({
    adapter: appointmentAdapter,
    source: {
      load() {
        loads += 1;
        return [];
      },
    },
  });

  assert.equal(loads, 0);

  await app.buildSnapshot({
    start: { year: 1, month: 1, day: 1 },
    end: { year: 1, month: 1, day: 1 },
  });

  assert.equal(loads, 1);
});

test('CalendarApp rejects duplicate module registrations', () => {
  const app = new CalendarApp({
    timeSource: {
      getCurrentPoint: () => ({
        date: { year: 1, month: 1, day: 1 },
      }),
    },
  });

  const binding = {
    adapter: appointmentAdapter,
    source: {
      load: () => [],
    },
  };

  app.registerModule(binding);

  assert.throws(
    () => app.registerModule(binding),
    /already registered/,
  );
});
