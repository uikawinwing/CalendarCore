import assert from 'node:assert/strict';
import test from 'node:test';

import {
  addCalendarDays,
  assertValidCalendarDate,
  enumerateCalendarDateRange,
  gregorianCalendarSystem,
  isGregorianLeapYear,
  type CalendarSystem,
} from '../src/index';

test('Gregorian implementation preserves leap-year behavior', () => {
  assert.equal(isGregorianLeapYear(2000), true);
  assert.equal(isGregorianLeapYear(1900), false);
  assert.equal(isGregorianLeapYear(2024), true);
  assert.equal(gregorianCalendarSystem.daysInMonth(2024, 2), 29);
  assert.equal(gregorianCalendarSystem.daysInMonth(2023, 2), 28);
});

test('date arithmetic crosses month and year boundaries in both directions', () => {
  assert.deepEqual(
    addCalendarDays({ year: 2024, month: 2, day: 28 }, 2),
    { year: 2024, month: 3, day: 1 },
  );

  assert.deepEqual(
    addCalendarDays({ year: 2025, month: 1, day: 1 }, -1),
    { year: 2024, month: 12, day: 31 },
  );
});

test('core date arithmetic works with a non-Gregorian calendar system', () => {
  const tenMonthCalendar: CalendarSystem = {
    id: 'ten-month-fixture',
    monthsInYear: () => 10,
    daysInMonth: () => 36,
  };

  assert.deepEqual(
    addCalendarDays(
      { year: 7, month: 10, day: 36 },
      1,
      tenMonthCalendar,
    ),
    { year: 8, month: 1, day: 1 },
  );

  assert.deepEqual(
    enumerateCalendarDateRange(
      {
        start: { year: 7, month: 10, day: 35 },
        end: { year: 8, month: 1, day: 2 },
      },
      tenMonthCalendar,
    ),
    [
      { year: 7, month: 10, day: 35 },
      { year: 7, month: 10, day: 36 },
      { year: 8, month: 1, day: 1 },
      { year: 8, month: 1, day: 2 },
    ],
  );
});

test('invalid dates and underflow before year 1 fail loudly', () => {
  assert.throws(
    () => assertValidCalendarDate({ year: 2024, month: 2, day: 30 }),
    /day must be between/,
  );

  assert.throws(
    () => addCalendarDays({ year: 1, month: 1, day: 1 }, -1),
    /before year 1/,
  );
});
