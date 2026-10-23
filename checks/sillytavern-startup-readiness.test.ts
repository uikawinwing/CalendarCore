import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SillyTavernMessageVariableReader,
  type SillyTavernRuntime,
} from '../src/host/sillytavern';
import {
  inspectSillyTavernCalendarReadiness,
  parseDestinyWorldTime,
} from '../src/integrations/sillytavern/readiness';
import { SillyTavernCalendarBridge } from '../src/integrations/sillytavern/bridge';

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
    { calendar: configuredCalendar, stat_data: { 角色: 'test' } },
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

test('MVU world time from the screenshot initializes the calendar without a calendar namespace', async () => {
  const worldString = '复兴纪元488年-04月-12日-星期三-11:45';
  const raw = {
    stat_data: {
      世界: { 时间: worldString, 地点: '阿斯塔利亚' },
      事件: { 开启: false, 结束: false },
    },
  };
  const runtime = makeRuntime(raw, 4);
  const ready = inspectSillyTavernCalendarReadiness(runtime);
  assert.equal(ready.ready, true);
  if (!ready.ready) return;
  assert.deepEqual(ready.currentDate, { year: 488, month: 4, day: 12 });
  assert.deepEqual(ready.weekAnchor, {
    date: { year: 488, month: 4, day: 12 },
    weekday: 3,
  });
  assert.equal(ready.timePath, 'stat_data.世界.时间');
  assert.deepEqual(ready.timeParser?.(worldString)?.time, { hour: 11, minute: 45 });

  const bridge = new SillyTavernCalendarBridge({
    runtime,
    timePath: ready.timePath,
    timeParser: ready.timeParser,
  });
  const session = await bridge.createMonthSession({
    weekAnchor: ready.weekAnchor,
    selectedDate: ready.currentDate,
  });
  const model = await session.load();
  assert.equal(model.year, 488);
  assert.equal(model.month, 4);
  assert.equal(model.selectedDay?.date.day, 12);
  const selected = model.cells.find(cell => cell.isSelected);
  assert.equal(selected?.weekday, 3);
});

test('world clock parser validates seven-day formats and rejects invalid clock values', () => {
  assert.equal(parseDestinyWorldTime('复兴纪元488年-04月-12日-星期三-11:45')?.weekAnchor.weekday, 3);
  assert.equal(parseDestinyWorldTime('星历12年-1月-1日-星期日-00:00')?.weekAnchor.weekday, 0);
  assert.equal(parseDestinyWorldTime('纪元12年-1月-1日-周天-23:59')?.weekAnchor.weekday, 0);
  assert.equal(parseDestinyWorldTime('纪元12年-1月-1日-星期七-23:59'), null);
  assert.equal(parseDestinyWorldTime('纪元12年-13月-1日-星期三-11:45'), null);
  assert.equal(parseDestinyWorldTime('纪元12年-1月-1日-星期三-29:45'), null);
  assert.equal(parseDestinyWorldTime('纪元12年-1月-1日-星期三-11:99'), null);
});

test('a valid structured calendar still takes precedence over the world string', () => {
  const raw = {
    calendar: configuredCalendar,
    stat_data: { 世界: { 时间: '复兴纪元488年-04月-12日-星期三-11:45' } },
  };
  const ready = inspectSillyTavernCalendarReadiness(makeRuntime(raw));
  assert.equal(ready.ready, true);
  if (ready.ready) {
    assert.equal(ready.timePath, 'calendar.now');
    assert.deepEqual(ready.currentDate, { year: 1002, month: 12, day: 31 });
  }
});

test('partially configured calendar does not hide valid stat_data from MVU', () => {
  const runtime: SillyTavernRuntime = {
    getLastMessageId: () => 4,
    getMvuData: () => ({
      stat_data: { 世界: { 时间: '复兴纪元488年-04月-12日-星期三-11:45' } },
    }),
    getVariables: () => ({ calendar: { now: { date: { year: 488 } } } }),
  };
  const ready = inspectSillyTavernCalendarReadiness(runtime);
  assert.equal(ready.ready, true);
  if (ready.ready) assert.equal(ready.timePath, 'stat_data.世界.时间');
});

