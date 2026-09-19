import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SillyTavernCalendarBridge,
  festivalAdapter,
  type FestivalDefinition,
  type SillyTavernRuntime,
} from '../src/index';

test('SillyTavern bridge composes host sources into a usable month session', async () => {
  const runtime: SillyTavernRuntime = {
    getLastMessageId: () => 12,
    getVariables: () => ({
      calendar: {
        now: {
          date: {
            year: 1002,
            month: 12,
            day: 31,
          },
        },
        modules: {
          festival: [
            {
              id: 'new-year',
              title: '跨年祭',
              start: { month: 12, day: 30 },
              end: { month: 1, day: 3 },
              anchorYear: 1000,
              repeatEveryYears: 2,
            },
          ],
        },
      },
    }),
  };

  const bridge = new SillyTavernCalendarBridge({
    runtime,
    timePath: 'calendar.now',
  });

  bridge.registerModule<FestivalDefinition>({
    adapter: festivalAdapter,
    path: 'calendar.modules.festival',
    parser(value) {
      return Array.isArray(value)
        ? (value as FestivalDefinition[])
        : null;
    },
  });

  const session = await bridge.createMonthSession({
    weekAnchor: {
      date: {
        year: 1002,
        month: 12,
        day: 31,
      },
      weekday: 2,
    },
  });

  const model = await session.load();

  assert.equal(model.year, 1002);
  assert.equal(model.month, 12);

  const festivalCell = model.cells.find(
    cell =>
      cell.date.year === 1002 &&
      cell.date.month === 12 &&
      cell.date.day === 30,
  );

  assert.deepEqual(
    festivalCell?.occurrences.map(
      occurrence => occurrence.event.id,
    ),
    ['new-year'],
  );
});

test('bridge defaults initial month to the current world date', async () => {
  const runtime: SillyTavernRuntime = {
    getLastMessageId: () => 1,
    getVariables: () => ({
      calendar: {
        now: {
          date: {
            year: 88,
            month: 4,
            day: 9,
          },
        },
      },
    }),
  };

  const bridge = new SillyTavernCalendarBridge({
    runtime,
    timePath: 'calendar.now',
  });

  const session = await bridge.createMonthSession({
    weekAnchor: {
      date: {
        year: 88,
        month: 4,
        day: 9,
      },
      weekday: 0,
    },
  });

  assert.deepEqual(
    session.getCurrentMonth(),
    { year: 88, month: 4 },
  );
});
