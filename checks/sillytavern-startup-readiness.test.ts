import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SillyTavernMessageVariableReader,
  type SillyTavernRuntime,
} from '../src/host/sillytavern';
import { inspectSillyTavernCalendarReadiness } from '../src/integrations/sillytavern/readiness';

const configuredCalendar = {
  now: { date: { year: 1002, month: 12, day: 31 } },
  weekAnchor: {
    date: { year: 1002, month: 12, day: 31 },
    weekday: 2,
  },
};

function makeRuntime(variables: Record<string, unknown>, messageId = 0): SillyTavernRuntime {
  return {
    getLastMessageId: () => messageId,
    getVariables: () => variables,
  };
}

test('brand-new chat without messages is a waiting state and never fetches message variables', () => {
  let requested = false;
  const result = inspectSillyTavernCalendarReadiness({
    getLastMessageId: () => -1,
    getVariables: () => {
      requested = true;
      throw new Error('Should not read variables before a message exists');
    },
  });
  assert.equal(result.ready, false);
  assert.equal(requested, false);
});

test('empty and partly initialized game variables safely return waiting state', () => {
  assert.equal(inspectSillyTavernCalendarReadiness(makeRuntime({})).ready, false);
  assert.equal(inspectSillyTavernCalendarReadiness(makeRuntime({
    calendar: { now: configuredCalendar.now },
  })).ready, false);
  assert.equal(inspectSillyTavernCalendarReadiness(makeRuntime({
    calendar: { weekAnchor: configuredCalendar.weekAnchor },
  })).ready, false);
});

test('valid game variables transition from waiting to ready without any writes', () => {
  let gameVariables: Record<string, unknown> = {};
  const runtime: SillyTavernRuntime = {
    getLastMessageId: () => 3,
    getVariables: () => gameVariables,
  };
  assert.equal(inspectSillyTavernCalendarReadiness(runtime).ready, false);
  gameVariables = { calendar: configuredCalendar };
  const result = inspectSillyTavernCalendarReadiness(runtime);
  assert.equal(result.ready, true);
  if (result.ready) {
    assert.deepEqual(result.currentDate, { year: 1002, month: 12, day: 31 });
    assert.equal(result.weekAnchor.weekday, 2);
  }
});

test('malformed calendar values remain waiting rather than terminating game startup', () => {
  const wrongDate = inspectSillyTavernCalendarReadiness(makeRuntime({
    calendar: { ...configuredCalendar, now: { date: { year: 1002, month: 13, day: 31 } } },
  }));
  assert.equal(wrongDate.ready, false);
  const wrongWeekday = inspectSillyTavernCalendarReadiness(makeRuntime({
    calendar: { ...configuredCalendar, weekAnchor: { ...configuredCalendar.weekAnchor, weekday: 7 } },
  }));
  assert.equal(wrongWeekday.ready, false);
});

test('MVU data without calendar does not hide valid ordinary message calendar variables', () => {
  const runtime: SillyTavernRuntime = {
    getLastMessageId: () => 5,
    getMvuData: () => ({ stat_data: { 角色: 'test' } }),
    getVariables: () => ({ calendar: configuredCalendar }),
  };
  assert.deepEqual(
    new SillyTavernMessageVariableReader(runtime).readLatest(),
    { calendar: configuredCalendar },
  );
  assert.equal(inspectSillyTavernCalendarReadiness(runtime).ready, true);
});

test('MVU calendar retains priority when both MVU and message variables provide it', () => {
  const runtime: SillyTavernRuntime = {
    getLastMessageId: () => 5,
    getMvuData: () => ({ calendar: configuredCalendar }),
    getVariables: () => ({ calendar: { ...configuredCalendar, now: null } }),
  };
  assert.equal(inspectSillyTavernCalendarReadiness(runtime).ready, true);
});
