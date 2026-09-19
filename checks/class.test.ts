import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classAdapter,
  parseClassDefinitions,
  queryCalendarOccurrences,
} from '../src/index';

test('Class uses generic recurrence with an inclusive term end', () => {
  const event = classAdapter.normalize({
    id: 'alchemy-101',
    title: 'Alchemy 101',
    start: {
      date: { year: 2026, month: 9, day: 1 },
      time: { hour: 9, minute: 0 },
    },
    end: {
      date: { year: 2026, month: 9, day: 1 },
      time: { hour: 10, minute: 30 },
    },
    recurrence: {
      frequency: 'weekly',
      until: { year: 2026, month: 9, day: 22 },
    },
    courseId: 'ALC-101',
    instructor: 'Professor Mira',
    location: 'Lab A',
  });

  const value = Array.isArray(event) ? event[0] : event;
  const occurrences = queryCalendarOccurrences(
    [value],
    {
      start: { year: 2026, month: 9, day: 1 },
      end: { year: 2026, month: 10, day: 31 },
    },
  );

  assert.equal(value.kind, 'class');
  assert.equal(value.allDay, false);
  assert.equal(value.payload?.courseId, 'ALC-101');
  assert.equal(value.payload?.instructor, 'Professor Mira');
  assert.equal(occurrences.length, 4);
  assert.deepEqual(
    occurrences.at(-1)?.start.date,
    { year: 2026, month: 9, day: 22 },
  );
});

test('Class parser accepts recurrence until and rejects malformed schedules', () => {
  const parsed = parseClassDefinitions([
    {
      id: 'history',
      title: 'History',
      start: {
        date: { year: 100, month: 1, day: 3 },
        time: { hour: 13, minute: 0 },
      },
      recurrence: {
        frequency: 'weekly',
        until: { year: 100, month: 3, day: 30 },
      },
      instructor: 'Teacher',
    },
  ]);

  assert.deepEqual(
    parsed?.[0]?.recurrence?.until,
    { year: 100, month: 3, day: 30 },
  );

  assert.equal(
    parseClassDefinitions([
      {
        id: 'bad',
        title: 'Bad',
        start: {
          date: { year: 100, month: 1, day: 3 },
        },
        recurrence: {
          frequency: 'weekly',
          until: { month: 3, day: 30 },
        },
      },
    ]),
    null,
  );
});

test('missing Class module data is an empty module', () => {
  assert.deepEqual(parseClassDefinitions(undefined), []);
});
