import assert from 'node:assert/strict';
import test from 'node:test';

import { parseCalendarWeekAnchor } from '../src/index';

test('week anchor parser accepts the new structured runtime contract', () => {
  assert.deepEqual(
    parseCalendarWeekAnchor({
      date: {
        year: 1000,
        month: 5,
        day: 14,
      },
      weekday: 3,
    }),
    {
      date: {
        year: 1000,
        month: 5,
        day: 14,
      },
      weekday: 3,
    },
  );
});

test('week anchor parser rejects incomplete data', () => {
  assert.equal(
    parseCalendarWeekAnchor({
      date: {
        year: 1000,
        month: 5,
      },
      weekday: 3,
    }),
    null,
  );

  assert.equal(
    parseCalendarWeekAnchor({
      date: {
        year: 1000,
        month: 5,
        day: 14,
      },
      weekday: -1,
    }),
    null,
  );
});
