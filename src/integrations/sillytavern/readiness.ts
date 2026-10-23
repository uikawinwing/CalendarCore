import {
  assertValidCalendarDate,
  type CalendarDate,
  type CalendarPoint,
  type CalendarWeekAnchor,
} from '../../core';
import {
  parseStructuredCalendarPoint,
  readValueAtPath,
  SillyTavernMessageVariableReader,
  type CalendarTimeParser,
  type SillyTavernRuntime,
} from '../../host/sillytavern';
import { parseCalendarWeekAnchor } from './config';

export type CalendarReadiness =
  | {
      ready: true;
      currentDate: CalendarDate;
      weekAnchor: CalendarWeekAnchor;
      timePath: 'calendar.now' | 'stat_data.世界.时间';
      timeParser?: CalendarTimeParser;
    }
  | { ready: false; message: string };

function waiting(message: string): CalendarReadiness {
  return { ready: false, message };
}

const DAY_OF_WEEK: Record<string, number> = {
  日: 0, 天: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6,
};

export interface ParsedWorldTime {
  point: CalendarPoint;
  weekAnchor: CalendarWeekAnchor;
}

/**
 * The Destiny MVU world clock has a human-readable value such as
 * "复兴纪元488年-04月-12日-星期三-11:45".
 *
 * Its weekday is the world's own reference, not one recomputed from the
 * real-world Gregorian weekday of that era year.
 */
export function parseDestinyWorldTime(value: unknown): ParsedWorldTime | null {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(
    /^(?:[^\d\n]*?)(\d{1,6})年\s*[-－—–]?\s*(\d{1,2})月\s*[-－—–]?\s*(\d{1,2})日\s*[-－—–]?\s*(?:星期|周)([日天一二三四五六])\s*[-－—–]?\s*(\d{1,2})[:：](\d{2})\s*$/,
  );
  if (!match) return null;

  const [, yearText, monthText, dayText, weekdayText, hourText, minuteText] = match;
  const date = {
    year: Number(yearText),
    month: Number(monthText),
    day: Number(dayText),
  };
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const weekday = DAY_OF_WEEK[weekdayText ?? ''];
  if (weekday === undefined || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }
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

export const parseDestinyWorldPoint: CalendarTimeParser = value =>
  parseDestinyWorldTime(value)?.point ?? null;

/**
 * A missing clock is not a reason to crash the host application.
 * Prefer a complete structured calendar, then fall back to the real MVU
 * stat_data.世界.时间 used by the game; never write synthetic variables.
 */
export function inspectSillyTavernCalendarReadiness(runtime: SillyTavernRuntime): CalendarReadiness {
  const messageId = runtime.getLastMessageId();
  if (!Number.isInteger(messageId) || messageId < 0) {
    return waiting('等待聊天消息和世界时间变量初始化');
  }

  let variables: Record<string, unknown>;
  try {
    variables = new SillyTavernMessageVariableReader(runtime).readLatest();
  } catch {
    return waiting('等待当前消息变量就绪');
  }

  const calendarNow = readValueAtPath(variables, 'calendar.now');
  const anchorValue = readValueAtPath(variables, 'calendar.weekAnchor');
  if (calendarNow !== undefined && calendarNow !== null &&
      anchorValue !== undefined && anchorValue !== null) {
    const point = parseStructuredCalendarPoint(calendarNow);
    const anchor = parseCalendarWeekAnchor(anchorValue);
    if (point && anchor && anchor.weekday <= 6) {
      try {
        assertValidCalendarDate(point.date);
        assertValidCalendarDate(anchor.date);
        return {
          ready: true,
          currentDate: { ...point.date },
          weekAnchor: anchor,
          timePath: 'calendar.now',
        };
      } catch {
        // Try the valid world time string below.
      }
    }
  }

  const worldTimeValue = readValueAtPath(variables, 'stat_data.世界.时间');
  const world = parseDestinyWorldTime(worldTimeValue);
  if (world) {
    return {
      ready: true,
      currentDate: { ...world.point.date },
      weekAnchor: world.weekAnchor,
      timePath: 'stat_data.世界.时间',
      timeParser: parseDestinyWorldPoint,
    };
  }

  if (typeof worldTimeValue === 'string') {
    return waiting('无法解析 stat_data.世界.时间，请检查年月日、星期及时间格式');
  }
  if (calendarNow !== undefined || anchorValue !== undefined) {
    return waiting('calendar.now / calendar.weekAnchor 未完整初始化或格式无效');
  }
  return waiting('等待 stat_data.世界.时间 或 calendar.now 初始化');
}

