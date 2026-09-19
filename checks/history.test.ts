import assert from 'node:assert/strict';
import test from 'node:test';

import {
  historyAdapter,
  parseHistoryDefinitions,
  queryCalendarOccurrences,
} from '../src/index';

test('History stores an immutable one-time record without recurrence', () => {
  const event = historyAdapter.normalize({
    id: 'completed-meeting',
    title: 'Met Ellia',
    occurredAt: {
      date: { year: 2026, month: 9, day: 20 },
      time: { hour: 15, minute: 0 },
    },
    source: {
      moduleId: 'appointment',
      eventId: 'meeting',
    },
    outcome: 'Meeting completed',
    notes: 'Kept the ticket',
  });

  const value = Array.isArray(event) ? event[0] : event;

  assert.equal(value.kind, 'history');
  assert.equal(value.recurrence, undefined);
  assert.equal(value.allDay, false);
  assert.deepEqual(value.payload?.source, {
    moduleId: 'appointment',
    eventId: 'meeting',
  });
  assert.equal(value.payload?.outcome, 'Meeting completed');

  const occurrences = queryCalendarOccurrences(
    [value],
    {
      start: { year: 2026, month: 9, day: 1 },
      end: { year: 2027, month: 9, day: 30 },
    },
  );

  assert.equal(occurrences.length, 1);
});

test('History parser validates loose source references', () => {
  const parsed = parseHistoryDefinitions([
    {
      id: 'class-record',
      title: 'Finished Alchemy class',
      occurredAt: {
        date: { year: 100, month: 3, day: 1 },
      },
      source: {
        moduleId: 'class',
        eventId: 'alchemy-101',
      },
      outcome: 'Passed',
    },
  ]);

  assert.deepEqual(parsed?.[0]?.source, {
    moduleId: 'class',
    eventId: 'alchemy-101',
  });

  assert.equal(
    parseHistoryDefinitions([
      {
        id: 'bad',
        title: 'Bad',
        occurredAt: {
          date: { year: 100, month: 3, day: 1 },
        },
        source: {
          eventId: 'missing-module',
        },
      },
    ]),
    null,
  );
});

test('History does not mutate or require the source event to exist', () => {
  const event = historyAdapter.normalize({
    id: 'orphan-record',
    title: 'Imported old memory',
    occurredAt: {
      date: { year: 50, month: 1, day: 1 },
    },
    source: {
      moduleId: 'legacy-external',
      eventId: 'gone-event',
    },
  });

  const value = Array.isArray(event) ? event[0] : event;

  assert.deepEqual(value.payload?.source, {
    moduleId: 'legacy-external',
    eventId: 'gone-event',
  });
});

test('missing History module data is an empty module', () => {
  assert.deepEqual(parseHistoryDefinitions(undefined), []);
});
