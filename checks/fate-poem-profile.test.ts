import assert from 'node:assert/strict';
import test from 'node:test';
import {
  type SillyTavernRuntime,
} from '../src/host/sillytavern';
import { SillyTavernCalendarBridge } from '../src/integrations/sillytavern/bridge';
import { inspectSillyTavernCalendarReadiness } from '../src/integrations/sillytavern/readiness';
import { fatePoemProfile, parseFatePoemWorldTime, FATE_POEM_PATHS } from '../src/profiles';

const configuredCalendar = {
  now: { date: { year: 1002, month: 12, day: 31 } },
  weekAnchor: { date: { year: 1002, month: 12, day: 31 }, weekday: 2 },
};
function makeRuntime(variables: Record<string, unknown>, messageId = 0): SillyTavernRuntime {
  return {
    getLastMessageId: () => messageId,
    getVariables: () => variables,
  };
}

test('MVU world time from the screenshot initializes the calendar without a calendar namespace', async () => {
  const worldString = '复兴纪元488年-04月-12日-星期三-11:45';
  const raw = {
    stat_data: {
      世界: { 时间: worldString, 地点: '阿斯塔利亚' },
      事件: { 开启: false, 结束: false },
    },
  };
  const runtime = makeRuntime(raw, 4);
  const ready = inspectSillyTavernCalendarReadiness(runtime, [fatePoemProfile]);
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
  assert.equal(parseFatePoemWorldTime('复兴纪元488年-04月-12日-星期三-11:45')?.weekAnchor.weekday, 3);
  assert.equal(parseFatePoemWorldTime('星历12年-1月-1日-星期日-00:00')?.weekAnchor.weekday, 0);
  assert.equal(parseFatePoemWorldTime('纪元12年-1月-1日-周天-23:59')?.weekAnchor.weekday, 0);
  assert.equal(parseFatePoemWorldTime('纪元12年-1月-1日-星期七-23:59'), null);
  assert.equal(parseFatePoemWorldTime('纪元12年-13月-1日-星期三-11:45'), null);
  assert.equal(parseFatePoemWorldTime('纪元12年-1月-1日-星期三-29:45'), null);
  assert.equal(parseFatePoemWorldTime('纪元12年-1月-1日-星期三-11:99'), null);
});

test('a valid structured calendar still takes precedence over the world string', () => {
  const raw = {
    calendar: configuredCalendar,
    stat_data: { 世界: { 时间: '复兴纪元488年-04月-12日-星期三-11:45' } },
  };
  const ready = inspectSillyTavernCalendarReadiness(makeRuntime(raw), [fatePoemProfile]);
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
  const ready = inspectSillyTavernCalendarReadiness(runtime, [fatePoemProfile]);
  assert.equal(ready.ready, true);
  if (ready.ready) assert.equal(ready.timePath, 'stat_data.世界.时间');
});


test('Worldbook-specific paths stay in the optional Profile and not the universal bootstrap', () => {
  assert.equal(FATE_POEM_PATHS.worldTime, 'stat_data.世界.时间');
  assert.equal(FATE_POEM_PATHS.location, 'stat_data.世界.地点');
  assert.equal(FATE_POEM_PATHS.eventState, 'stat_data.事件');
  assert.equal(FATE_POEM_PATHS.completedEvents, 'stat_data.事件.已完成事件');
  assert.equal(FATE_POEM_PATHS.eventSignals, 'stat_data.事件.信号');
  const runtime = makeRuntime({
    stat_data: {
      世界: { 时间: '复兴纪元488年-04月-12日-星期三-11:45' },
      事件: { 开启: true, 结束: false, 标题: '剧情事件', 阶段: '开始' },
    },
  });
  // The core has no knowledge of this worldbook until the Profile is supplied.
  assert.equal(inspectSillyTavernCalendarReadiness(runtime).ready, false);
  const ready = inspectSillyTavernCalendarReadiness(runtime, [fatePoemProfile]);
  assert.equal(ready.ready, true);
  if (ready.ready) assert.equal(ready.profileId, 'fate-poem');
});
