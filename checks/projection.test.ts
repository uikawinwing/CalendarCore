import assert from 'node:assert/strict';
import test from 'node:test';

import {
  projectCalendarDays,
  queryCalendarOccurrences,
  type CalendarEvent,
} from '../src/index';

test('day projection keeps empty days and repeats multi-day occurrences on covered dates', () => {
  const events: CalendarEvent[] = [
    {
      id: 'trip',
      moduleId: 'fixture',
      kind: 'trip',
      title: 'Trip',
      start: { date: { year: 2026, month: 9, day: 2 } },
      end: { date: { year: 2026, month: 9, day: 4 } },
    },
    {
      id: 'meeting',
      moduleId: 'fixture',
      kind: 'meeting',
      title: 'Meeting',
      start: {
        date: { year: 2026, month: 9, day: 4 },
        time: { hour: 10, minute: 0 },
      },
    },
  ];

  const range = {
    start: { year: 2026, month: 9, day: 1 },
    end: { year: 2026, month: 9, day: 5 },
  };

  const projection = projectCalendarDays(
    queryCalendarOccurrences(events, range),
    range,
  );

  assert.equal(projection.length, 5);
  assert.deepEqual(projection[0]?.occurrences.map(value => value.event.id), []);
  assert.deepEqual(projection[1]?.occurrences.map(value => value.event.id), ['trip']);
  assert.deepEqual(projection[2]?.occurrences.map(value => value.event.id), ['trip']);
  assert.deepEqual(
    projection[3]?.occurrences.map(value => value.event.id),
    ['trip', 'meeting'],
  );
  assert.deepEqual(projection[4]?.occurrences.map(value => value.event.id), []);
});
