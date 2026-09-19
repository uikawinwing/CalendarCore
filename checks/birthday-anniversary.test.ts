import assert from 'node:assert/strict';
import test from 'node:test';

import {
  anniversaryAdapter,
  birthdayAdapter,
  parseAnniversaryDefinitions,
  parseBirthdayDefinitions,
  queryCalendarOccurrences,
} from '../src/index';

test('Birthday is a yearly all-day event with its origin preserved', () => {
  const event = birthdayAdapter.normalize({
    id: 'ellia-birthday',
    title: 'Ellia Birthday',
    date: {
      year: 980,
      month: 7,
      day: 12,
    },
    subject: 'Ellia',
  });

  const value = Array.isArray(event) ? event[0] : event;
  const occurrences = queryCalendarOccurrences(
    [value],
    {
      start: { year: 1000, month: 7, day: 1 },
      end: { year: 1000, month: 7, day: 31 },
    },
  );

  assert.equal(value.kind, 'birthday');
  assert.equal(value.allDay, true);
  assert.deepEqual(value.payload?.originDate, {
    year: 980,
    month: 7,
    day: 12,
  });
  assert.deepEqual(occurrences[0]?.start.date, {
    year: 1000,
    month: 7,
    day: 12,
  });
});

test('Anniversary keeps its own category and notes', () => {
  const event = anniversaryAdapter.normalize({
    id: 'first-meeting',
    title: 'First Meeting',
    date: {
      year: 995,
      month: 4,
      day: 3,
    },
    category: 'relationship',
    notes: 'Met under the clock tower',
  });

  const value = Array.isArray(event) ? event[0] : event;

  assert.equal(value.kind, 'anniversary');
  assert.equal(value.payload?.category, 'relationship');
  assert.equal(
    value.payload?.notes,
    'Met under the clock tower',
  );
});

test('Birthday parser accepts structured annual data', () => {
  const parsed = parseBirthdayDefinitions([
    {
      id: 'birthday',
      title: 'Birthday',
      date: {
        year: 12,
        month: 2,
        day: 20,
      },
      subject: 'Character',
      tags: ['personal'],
    },
  ]);

  assert.equal(parsed?.length, 1);
  assert.equal(parsed?.[0]?.subject, 'Character');
});

test('Anniversary parser rejects incomplete origin dates', () => {
  assert.equal(
    parseAnniversaryDefinitions([
      {
        id: 'bad',
        title: 'Bad',
        date: {
          month: 2,
          day: 20,
        },
      },
    ]),
    null,
  );
});

test('missing Birthday and Anniversary module data are empty modules', () => {
  assert.deepEqual(parseBirthdayDefinitions(undefined), []);
  assert.deepEqual(parseAnniversaryDefinitions(undefined), []);
});
