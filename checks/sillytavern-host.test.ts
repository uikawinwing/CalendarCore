import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CalendarApp,
  SillyTavernMessageModuleSource,
  SillyTavernMessageTimeSource,
  SillyTavernMessageVariableReader,
  festivalAdapter,
  parseStructuredCalendarPoint,
  readValueAtPath,
  type FestivalDefinition,
  type SillyTavernRuntime,
} from '../src/index';

test('message variable reader prefers MVU data when available', () => {
  const runtime: SillyTavernRuntime = {
    getLastMessageId: () => 42,
    getVariables: () => ({ source: 'variables' }),
    getMvuData: target => ({
      source: 'mvu',
      messageId: target.message_id,
    }),
  };

  const reader = new SillyTavernMessageVariableReader(runtime);

  assert.deepEqual(reader.readLatest(), {
    source: 'mvu',
    messageId: 42,
  });
});

test('message variable reader falls back when MVU throws', () => {
  const runtime: SillyTavernRuntime = {
    getLastMessageId: () => 7,
    getVariables: target => ({
      source: 'variables',
      messageId: target.message_id,
    }),
    getMvuData() {
      throw new Error('MVU not ready');
    },
  };

  const reader = new SillyTavernMessageVariableReader(runtime);

  assert.deepEqual(reader.readLatest(), {
    source: 'variables',
    messageId: 7,
  });
});

test('structured time source reads a configurable variable path', () => {
  const runtime: SillyTavernRuntime = {
    getLastMessageId: () => 3,
    getVariables: () => ({
      stat_data: {
        world: {
          time: {
            date: { year: 1024, month: 8, day: 15 },
            time: { hour: 9, minute: 30 },
          },
        },
      },
    }),
  };

  const reader = new SillyTavernMessageVariableReader(runtime);
  const source = new SillyTavernMessageTimeSource({
    reader,
    path: 'stat_data.world.time',
  });

  assert.deepEqual(source.getCurrentPoint(), {
    date: { year: 1024, month: 8, day: 15 },
    time: { hour: 9, minute: 30 },
  });
});

test('time source accepts a custom parser for character-specific formats', () => {
  const runtime: SillyTavernRuntime = {
    getLastMessageId: () => 1,
    getVariables: () => ({
      stat_data: {
        世界: {
          时辰: '星历二年五月二十三日',
        },
      },
    }),
  };

  const source = new SillyTavernMessageTimeSource({
    reader: new SillyTavernMessageVariableReader(runtime),
    path: ['stat_data', '世界', '时辰'],
    parser(value) {
      return value === '星历二年五月二十三日'
        ? { date: { year: 2, month: 5, day: 23 } }
        : null;
    },
  });

  assert.deepEqual(source.getCurrentPoint(), {
    date: { year: 2, month: 5, day: 23 },
  });
});

test('generic message module source feeds Festival into CalendarApp end-to-end', async () => {
  const runtime: SillyTavernRuntime = {
    getLastMessageId: () => 9,
    getVariables: () => ({
      calendar: {
        now: {
          date: { year: 1002, month: 12, day: 31 },
        },
        modules: {
          festival: [
            {
              id: 'new-year',
              title: '跨年祭',
              start: { month: 12, day: 30 },
              end: { month: 1, day: 3 },
              anchorYear: 1000,
              repeatEveryYears: 2,
            },
          ],
        },
      },
    }),
  };

  const reader = new SillyTavernMessageVariableReader(runtime);
  const app = new CalendarApp({
    timeSource: new SillyTavernMessageTimeSource({
      reader,
      path: 'calendar.now',
    }),
  });

  app.registerModule({
    adapter: festivalAdapter,
    source: new SillyTavernMessageModuleSource<FestivalDefinition>({
      reader,
      path: 'calendar.modules.festival',
      parser(value) {
        return Array.isArray(value)
          ? (value as FestivalDefinition[])
          : null;
      },
    }),
  });

  const snapshot = await app.buildSnapshot({
    start: { year: 1002, month: 12, day: 30 },
    end: { year: 1003, month: 1, day: 3 },
  });

  assert.deepEqual(snapshot.now.date, {
    year: 1002,
    month: 12,
    day: 31,
  });
  assert.equal(snapshot.events.length, 1);
  assert.equal(snapshot.occurrences.length, 1);
  assert.deepEqual(snapshot.occurrences[0]?.start.date, {
    year: 1002,
    month: 12,
    day: 30,
  });
  assert.deepEqual(snapshot.occurrences[0]?.end?.date, {
    year: 1003,
    month: 1,
    day: 3,
  });
  assert.equal(
    snapshot.days.every(day => day.occurrences.length === 1),
    true,
  );
});

test('path reader can address keys without lodash', () => {
  assert.equal(
    readValueAtPath(
      { root: { nested: { value: 123 } } },
      'root.nested.value',
    ),
    123,
  );

  assert.equal(
    readValueAtPath(
      { 'key.with.dot': { value: 456 } },
      ['key.with.dot', 'value'],
    ),
    456,
  );
});

test('structured parser rejects malformed points', () => {
  assert.equal(
    parseStructuredCalendarPoint({
      date: { year: 1, month: 2 },
    }),
    null,
  );
});
