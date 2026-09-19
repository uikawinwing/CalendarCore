import assert from 'node:assert/strict';
import test from 'node:test';

import {
  parseReminderDefinitions,
  queryCalendarOccurrences,
  reminderAdapter,
} from '../src/index';

test('Reminder can point at another module event without coupling to it', () => {
  const event = reminderAdapter.normalize({
    id: 'meeting-reminder',
    title: 'Meeting reminder',
    at: {
      date: { year: 2026, month: 9, day: 20 },
      time: { hour: 8, minute: 30 },
    },
    message: 'Bring the ticket',
    target: {
      moduleId: 'appointment',
      eventId: 'meeting',
    },
  });

  const value = Array.isArray(event) ? event[0] : event;

  assert.equal(value.kind, 'reminder');
  assert.equal(value.allDay, false);
  assert.deepEqual(value.payload?.target, {
    moduleId: 'appointment',
    eventId: 'meeting',
  });
  assert.equal(value.payload?.message, 'Bring the ticket');
});

test('Reminder recurrence uses generic bounded recurrence', () => {
  const event = reminderAdapter.normalize({
    id: 'medicine',
    title: 'Medicine',
    at: {
      date: { year: 2026, month: 9, day: 1 },
      time: { hour: 9, minute: 0 },
    },
    recurrence: {
      frequency: 'daily',
      until: { year: 2026, month: 9, day: 3 },
    },
  });

  const value = Array.isArray(event) ? event[0] : event;
  const occurrences = queryCalendarOccurrences(
    [value],
    {
      start: { year: 2026, month: 9, day: 1 },
      end: { year: 2026, month: 9, day: 10 },
    },
  );

  assert.equal(occurrences.length, 3);
});

test('Reminder parser validates relation targets', () => {
  const parsed = parseReminderDefinitions([
    {
      id: 'good',
      title: 'Good',
      at: {
        date: { year: 10, month: 2, day: 3 },
      },
      target: {
        moduleId: 'event',
        eventId: 'market',
      },
    },
  ]);

  assert.deepEqual(parsed?.[0]?.target, {
    moduleId: 'event',
    eventId: 'market',
  });

  assert.equal(
    parseReminderDefinitions([
      {
        id: 'bad',
        title: 'Bad',
        at: {
          date: { year: 10, month: 2, day: 3 },
        },
        target: {
          moduleId: 'event',
        },
      },
    ]),
    null,
  );
});

test('missing Reminder module data is an empty module', () => {
  assert.deepEqual(parseReminderDefinitions(undefined), []);
});
