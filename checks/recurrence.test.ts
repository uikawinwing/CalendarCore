import assert from 'node:assert/strict';
import test from 'node:test';

import {
  expandCalendarEventOccurrences,
  queryCalendarOccurrences,
  type CalendarEvent,
  type CalendarSystem,
} from '../src/index';

test('recurrence is anchored to event start and never creates earlier occurrences', () => {
  const event: CalendarEvent = {
    id: 'daily',
    moduleId: 'fixture',
    kind: 'fixture',
    title: 'Daily',
    start: { date: { year: 2026, month: 9, day: 10 } },
    recurrence: { frequency: 'daily' },
  };

  assert.deepEqual(
    expandCalendarEventOccurrences(event, {
      start: { year: 2026, month: 9, day: 1 },
      end: { year: 2026, month: 9, day: 12 },
    }).map(value => value.start.date),
    [
      { year: 2026, month: 9, day: 10 },
      { year: 2026, month: 9, day: 11 },
      { year: 2026, month: 9, day: 12 },
    ],
  );
});

test('monthly recurrence derives each occurrence from the original anchor', () => {
  const event: CalendarEvent = {
    id: 'month-end',
    moduleId: 'fixture',
    kind: 'fixture',
    title: 'Month end',
    start: { date: { year: 2024, month: 1, day: 31 } },
    recurrence: { frequency: 'monthly' },
  };

  assert.deepEqual(
    expandCalendarEventOccurrences(event, {
      start: { year: 2024, month: 2, day: 1 },
      end: { year: 2024, month: 3, day: 31 },
    }).map(value => value.start.date),
    [
      { year: 2024, month: 2, day: 29 },
      { year: 2024, month: 3, day: 31 },
    ],
  );
});

test('weekly recurrence respects the calendar system week length', () => {
  const fiveDayWeek: CalendarSystem = {
    id: 'five-day-week',
    daysInWeek: 5,
    monthsInYear: () => 10,
    daysInMonth: () => 36,
  };

  const event: CalendarEvent = {
    id: 'weekly',
    moduleId: 'fixture',
    kind: 'fixture',
    title: 'Weekly',
    start: { date: { year: 1, month: 1, day: 1 } },
    recurrence: { frequency: 'weekly' },
  };

  assert.deepEqual(
    expandCalendarEventOccurrences(
      event,
      {
        start: { year: 1, month: 1, day: 1 },
        end: { year: 1, month: 1, day: 16 },
      },
      fiveDayWeek,
    ).map(value => value.start.date),
    [
      { year: 1, month: 1, day: 1 },
      { year: 1, month: 1, day: 6 },
      { year: 1, month: 1, day: 11 },
      { year: 1, month: 1, day: 16 },
    ],
  );
});

test('recurrence until is inclusive and stops future occurrences', () => {
  const event: CalendarEvent = {
    id: 'term-class',
    moduleId: 'fixture',
    kind: 'fixture',
    title: 'Weekly class',
    start: { date: { year: 2026, month: 9, day: 1 } },
    recurrence: {
      frequency: 'weekly',
      until: { year: 2026, month: 9, day: 22 },
    },
  };

  assert.deepEqual(
    expandCalendarEventOccurrences(event, {
      start: { year: 2026, month: 9, day: 1 },
      end: { year: 2026, month: 10, day: 31 },
    }).map(value => value.start.date),
    [
      { year: 2026, month: 9, day: 1 },
      { year: 2026, month: 9, day: 8 },
      { year: 2026, month: 9, day: 15 },
      { year: 2026, month: 9, day: 22 },
    ],
  );
});

test('recurrence until before the event start is rejected', () => {
  const event: CalendarEvent = {
    id: 'bad-until',
    moduleId: 'fixture',
    kind: 'fixture',
    title: 'Bad',
    start: { date: { year: 2026, month: 9, day: 10 } },
    recurrence: {
      frequency: 'weekly',
      until: { year: 2026, month: 9, day: 1 },
    },
  };

  assert.throws(
    () =>
      expandCalendarEventOccurrences(event, {
        start: { year: 2026, month: 9, day: 1 },
        end: { year: 2026, month: 10, day: 1 },
      }),
    /until must not be before event start/,
  );
});

test('recurring end dates keep their own calendar anchor', () => {
  const crossYearFestival: CalendarEvent = {
    id: 'cross-year',
    moduleId: 'fixture',
    kind: 'fixture',
    title: 'Cross year',
    start: { date: { year: 2023, month: 12, day: 30 } },
    end: { date: { year: 2024, month: 1, day: 3 } },
    recurrence: { frequency: 'yearly' },
  };

  const [occurrence] = expandCalendarEventOccurrences(crossYearFestival, {
    start: { year: 2024, month: 12, day: 1 },
    end: { year: 2025, month: 1, day: 31 },
  });

  assert.deepEqual(occurrence?.start.date, { year: 2024, month: 12, day: 30 });
  assert.deepEqual(occurrence?.end?.date, { year: 2025, month: 1, day: 3 });
});

test('multi-day occurrences are returned when they overlap the query range', () => {
  const event: CalendarEvent = {
    id: 'trip',
    moduleId: 'fixture',
    kind: 'fixture',
    title: 'Trip',
    start: { date: { year: 2026, month: 9, day: 1 } },
    end: { date: { year: 2026, month: 9, day: 3 } },
    recurrence: { frequency: 'weekly' },
  };

  const occurrences = expandCalendarEventOccurrences(event, {
    start: { year: 2026, month: 9, day: 2 },
    end: { year: 2026, month: 9, day: 2 },
  });

  assert.equal(occurrences.length, 1);
  assert.deepEqual(occurrences[0]?.start.date, { year: 2026, month: 9, day: 1 });
  assert.deepEqual(occurrences[0]?.end?.date, { year: 2026, month: 9, day: 3 });
});

test('range query combines and sorts occurrences without module-specific logic', () => {
  const events: CalendarEvent[] = [
    {
      id: 'late',
      moduleId: 'a',
      kind: 'anything',
      title: 'Late',
      start: {
        date: { year: 2026, month: 9, day: 20 },
        time: { hour: 18, minute: 0 },
      },
    },
    {
      id: 'early',
      moduleId: 'b',
      kind: 'something-else',
      title: 'Early',
      start: {
        date: { year: 2026, month: 9, day: 20 },
        time: { hour: 9, minute: 0 },
      },
    },
  ];

  assert.deepEqual(
    queryCalendarOccurrences(events, {
      start: { year: 2026, month: 9, day: 20 },
      end: { year: 2026, month: 9, day: 20 },
    }).map(value => value.event.id),
    ['early', 'late'],
  );
});
