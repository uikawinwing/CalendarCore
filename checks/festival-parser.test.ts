import assert from 'node:assert/strict';
import test from 'node:test';

import { parseFestivalDefinitions } from '../src/index';

test('festival parser accepts clean structured module data', () => {
  const parsed = parseFestivalDefinitions([
    {
      id: 'stars',
      title: '观星祭',
      start: { month: 8, day: 12 },
      end: { month: 8, day: 14 },
      anchorYear: 1000,
      repeatEveryYears: 2,
      tags: ['festival'],
      stages: [
        {
          id: 'eve',
          title: '前夜',
          start: { month: 8, day: 11 },
        },
      ],
    },
  ]);

  assert.equal(parsed?.length, 1);
  assert.equal(parsed?.[0]?.repeatEveryYears, 2);
  assert.equal(parsed?.[0]?.stages?.[0]?.id, 'eve');
});

test('festival parser treats missing module data as an empty module', () => {
  assert.deepEqual(parseFestivalDefinitions(undefined), []);
  assert.deepEqual(parseFestivalDefinitions(null), []);
});

test('festival parser rejects malformed runtime data', () => {
  assert.equal(
    parseFestivalDefinitions([
      {
        id: 'bad',
        title: 'Bad',
        start: { month: 1 },
        anchorYear: 1000,
      },
    ]),
    null,
  );

  assert.equal(
    parseFestivalDefinitions({ not: 'an array' }),
    null,
  );
});
