import {
  assertValidCalendarDate,
  type CalendarDate,
  type CalendarWeekAnchor,
} from '../../core';
import {
  parseStructuredCalendarPoint,
  readValueAtPath,
  SillyTavernMessageVariableReader,
  type CalendarTimeParser,
  type SillyTavernRuntime,
} from '../../host/sillytavern';
import type { CalendarProfile } from '../../profiles/types';
import { parseCalendarWeekAnchor } from './config';

export type CalendarReadiness =
  | {
      ready: true;
      currentDate: CalendarDate;
      weekAnchor: CalendarWeekAnchor;
      timePath: string;
      profileId: string;
      timeParser?: CalendarTimeParser;
    }
  | { ready: false; message: string };

function waiting(message: string): CalendarReadiness {
  return { ready: false, message };
}

/**
 * Universal ST bootstrap accepts standard structured calendar variables.
 * All Worldbook-specific paths, parsers and event semantics live in profiles.
 * Profiles are supplied explicitly by the integration, never imported here.
 */
export function inspectSillyTavernCalendarReadiness(
  runtime: SillyTavernRuntime,
  profiles: readonly CalendarProfile[] = [],
): CalendarReadiness {
  const messageId = runtime.getLastMessageId();
  if (!Number.isInteger(messageId) || messageId < 0) {
    return waiting('等待聊天消息及世界时间初始化');
  }

  let variables: Record<string, unknown>;
  try {
    variables = new SillyTavernMessageVariableReader(runtime).readLatest();
  } catch {
    return waiting('等待当前消息变量就绪');
  }

  // Standard calendar contract has precedence over any optional Profile.
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
          profileId: 'structured',
        };
      } catch {
        // An incomplete standard calendar may still have a valid Profile.
      }
    }
  }

  for (const profile of profiles) {
    const match = profile.match(variables);
    if (match) {
      return {
        ready: true,
        currentDate: match.currentDate,
        weekAnchor: match.weekAnchor,
        timePath: match.timePath,
        profileId: match.profileId,
        timeParser: match.timeParser,
      };
    }
  }

  for (const profile of profiles) {
    const message = profile.diagnostic?.(variables);
    if (message) return waiting(message);
  }

  if (calendarNow !== undefined || anchorValue !== undefined) {
    return waiting('calendar.now / calendar.weekAnchor 未完整初始化或格式无效');
  }
  return waiting('等待有效的日历时间数据或已安装的 Profile');
}
