import {
  assertValidCalendarDate,
  type CalendarPoint,
  type CalendarWeekAnchor,
} from '../core';
import { readValueAtPath, type CalendarTimeParser } from '../host/sillytavern';
import type { CalendarProfile } from './types';

/**
 * Source: Worldbook-for-destined-journey, main:
 * 命定之诗/变量/[InitVar]世界初始设定.yaml
 * 命定之诗/变量/[mvu_update]变量更新规则.yaml
 * 命定之诗/事件/事件信号变量适配.ejs
 *
 * All paths and world-specific parsing stay in this profile. The existing
 * event-state fields are narrative flags, NOT calendar-dated event records.
 */
export const FATE_POEM_PATHS = Object.freeze({
  worldTime: 'stat_data.世界.时间',
  location: 'stat_data.世界.地点',
  eventState: 'stat_data.事件',
  completedEvents: 'stat_data.事件.已完成事件',
  eventSignals: 'stat_data.事件.信号', // optional EJS extension, not part of InitVar
});

const DAY_OF_WEEK: Record<string, number> = {
  日: 0, 天: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6,
};

export interface FatePoemWorldTime {
  point: CalendarPoint;
  weekAnchor: CalendarWeekAnchor;
}

/**
 * e.g. 复兴纪元488年-04月-12日-星期三-11:45.
 * Weekday is taken from the story world, not computed from the Gregorian date.
 */
export function parseFatePoemWorldTime(value: unknown): FatePoemWorldTime | null {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(
    /^(?:[^\d\n]*?)(\d{1,6})年\s*[-－—–]?\s*(\d{1,2})月\s*[-－—–]?\s*(\d{1,2})日\s*[-－—–]?\s*(?:星期|周)([日天一二三四五六])\s*[-－—–]?\s*(\d{1,2})[:：](\d{2})\s*$/,
  );
  if (!match) return null;
  const [, yearText, monthText, dayText, weekdayText, hourText, minuteText] = match;
  const date = { year: Number(yearText), month: Number(monthText), day: Number(dayText) };
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const weekday = DAY_OF_WEEK[weekdayText ?? ''];
  if (weekday === undefined || hour > 23 || minute > 59) return null;
  try {
    assertValidCalendarDate(date);
  } catch {
    return null;
  }
  return {
    point: { date, time: { hour, minute } },
    weekAnchor: { date: { ...date }, weekday },
  };
}

export const parseFatePoemWorldPoint: CalendarTimeParser = value =>
  parseFatePoemWorldTime(value)?.point ?? null;

export const fatePoemProfile: CalendarProfile = {
  id: 'fate-poem',
  label: '命定之诗',
  match(variables) {
    const raw = readValueAtPath(variables, FATE_POEM_PATHS.worldTime);
    const parsed = parseFatePoemWorldTime(raw);
    if (!parsed) return null;
    return {
      profileId: this.id,
      timePath: FATE_POEM_PATHS.worldTime,
      timeParser: parseFatePoemWorldPoint,
      currentDate: { ...parsed.point.date },
      weekAnchor: parsed.weekAnchor,
    };
  },
  diagnostic(variables) {
    const raw = readValueAtPath(variables, FATE_POEM_PATHS.worldTime);
    if (typeof raw === 'string' && raw.trim()) {
      return '命定之诗世界时间无法解析；检查年、月、日、星期及 24 小时时间';
    }
    return null;
  },
};
