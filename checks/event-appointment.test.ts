import assert from 'node:assert/strict';
import test from 'node:test';

import {
  appointmentAdapter,
  eventAdapter,
  parseAppointmentDefinitions,
  parseEventDefinitions,
  queryCalendarOccurrences,
} from '../src/index';

test('Event module normalizes one-time and recurring events', () => {
  const events = eventAdapter.normalize({
    id: 'market',
    title: '市集',
    start: {
      date: { year: 100, month: 3, day: 10 },
    },
    recurrence: {
      frequency: 'weekly',
      interval: 2,
    },
    summary: '城镇市集',
  });

  const values = Array.isArray(events) ? events : [events];
  const occurrences = queryCalendarOccurrences(values, {
    start: { year: 100, month: 3, day: 1 },
    end: { year: 100, month: 4, day: 10 },
  });

  assert.equal(values[0]?.moduleId, 'event');
  assert.equal(values[0]?.kind, 'event');
  assert.equal(values[0]?.allDay, true);
  assert.equal(occurrences.length, 3);
});

test('Appointment keeps location, attendees and notes in module payload', () => {
  const event = appointmentAdapter.normalize({
    id: 'meeting',
    title: '会面',
    start: {
      date: { year: 100, month: 5, day: 3 },
      time: { hour: 14, minute: 30 },
    },
    end: {
      date: { year: 100, month: 5, day: 3 },
      time: { hour: 15, minute: 30 },
    },
    location: '钟楼',
    attendees: ['Ellia', 'Player'],
    notes: '带上票根',
  });

  const value = Array.isArray(event) ? event[0] : event;

  assert.equal(value.allDay, false);
  assert.equal(value.payload?.location, '钟楼');
  assert.deepEqual(value.payload?.attendees, ['Ellia', 'Player']);
  assert.equal(value.payload?.notes, '带上票根');
});

test('Event runtime parser rejects malformed time and recurrence', () => {
  assert.equal(
    parseEventDefinitions([
      {
        id: 'bad-time',
        title: 'Bad',
        start: {
          date: { year: 1, month: 1, day: 1 },
          time: { hour: 27, minute: 0 },
        },
      },
    ]),
    null,
  );

  assert.equal(
    parseEventDefinitions([
      {
        id: 'bad-repeat',
        title: 'Bad',
        start: {
          date: { year: 1, month: 1, day: 1 },
        },
        recurrence: {
          frequency: 'hourly',
        },
      },
    ]),
    null,
  );
});

test('Appointment runtime parser accepts clean structured data', () => {
  const parsed = parseAppointmentDefinitions([
    {
      id: 'date',
      title: '约会',
      start: {
        date: { year: 10, month: 6, day: 20 },
        time: { hour: 18, minute: 0 },
      },
      location: '湖边',
      attendees: ['Ellia'],
      tags: ['personal'],
    },
  ]);

  assert.equal(parsed?.length, 1);
  assert.equal(parsed?.[0]?.location, '湖边');
  assert.deepEqual(parsed?.[0]?.attendees, ['Ellia']);
});

test('missing Event and Appointment module data are empty modules', () => {
  assert.deepEqual(parseEventDefinitions(undefined), []);
  assert.deepEqual(parseAppointmentDefinitions(undefined), []);
});
