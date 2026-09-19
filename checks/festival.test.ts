import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CalendarRegistry,
  festivalAdapter,
  queryCalendarOccurrences,
  type FestivalDefinition,
} from '../src/index';

test('festival adapter converts a cross-year recurring festival and its stages', () => {
  const registry = new CalendarRegistry();
  registry.register(festivalAdapter);

  const definition: FestivalDefinition = {
    id: 'new-year',
    title: '跨年祭',
    start: { month: 12, day: 30 },
    end: { month: 1, day: 3 },
    anchorYear: 1000,
    repeatEveryYears: 2,
    summary: '跨越新年的节庆',
    relatedBookIds: ['book-new-year'],
    locationKeywords: ['中央广场'],
    stages: [
      {
        id: 'eve',
        title: '前夜',
        start: { month: 12, day: 31 },
      },
    ],
  };

  const events = registry.normalize('festival', definition);

  assert.equal(events.length, 2);
  assert.equal(events[0]?.kind, 'festival');
  assert.equal(events[1]?.kind, 'festival-stage');
  assert.equal(events[0]?.recurrence?.interval, 2);
  assert.equal(events[1]?.recurrence?.interval, 2);

  const occurrences = queryCalendarOccurrences(events, {
    start: { year: 1002, month: 12, day: 1 },
    end: { year: 1003, month: 1, day: 10 },
  });

  const festival = occurrences.find(value => value.event.kind === 'festival');
  const stage = occurrences.find(value => value.event.kind === 'festival-stage');

  assert.deepEqual(festival?.start.date, { year: 1002, month: 12, day: 30 });
  assert.deepEqual(festival?.end?.date, { year: 1003, month: 1, day: 3 });
  assert.deepEqual(stage?.start.date, { year: 1002, month: 12, day: 31 });
});

test('festival stage can override recurrence without changing the parent', () => {
  const events = festivalAdapter.normalize({
    id: 'festival',
    title: 'Festival',
    start: { month: 5, day: 1 },
    anchorYear: 1000,
    repeatEveryYears: 2,
    stages: [
      {
        id: 'one-time-stage',
        title: 'One time',
        start: { month: 5, day: 2 },
        repeatEveryYears: null,
      },
    ],
  });

  const values = Array.isArray(events) ? events : [events];

  assert.equal(values[0]?.recurrence?.interval, 2);
  assert.equal(values[1]?.recurrence, undefined);
});

test('invalid festival recurrence is rejected by the module boundary', () => {
  assert.throws(
    () => festivalAdapter.normalize({
      id: 'bad',
      title: 'Bad',
      start: { month: 1, day: 1 },
      anchorYear: 1000,
      repeatEveryYears: 0,
    }),
    /positive integer/,
  );
});
