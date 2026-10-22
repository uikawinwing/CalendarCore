import { assertValidCalendarDate, type CalendarDate, type CalendarWeekAnchor } from '../../core';
import {
  parseStructuredCalendarPoint,
  readValueAtPath,
  SillyTavernMessageVariableReader,
  type SillyTavernRuntime,
} from '../../host/sillytavern';
import { parseCalendarWeekAnchor } from './config';

export type CalendarReadiness =
  | { ready: true; currentDate: CalendarDate; weekAnchor: CalendarWeekAnchor }
  | { ready: false; message: string };

function waiting(message: string): CalendarReadiness {
  return { ready: false, message };
}

/**
 * Probe the latest message without changing any game variables.
 * A brand-new chat, an absent schema or an incomplete setup is an idle state,
 * not a bootstrap failure. Never invent world dates or week anchors.
 */
export function inspectSillyTavernCalendarReadiness(runtime: SillyTavernRuntime): CalendarReadiness {
  const messageId = runtime.getLastMessageId();
  if (!Number.isInteger(messageId) || messageId < 0) {
    return waiting('等待聊天消息和历法数据初始化');
  }

  let variables: Record<string, unknown>;
  try {
    variables = new SillyTavernMessageVariableReader(runtime).readLatest();
  } catch {
    return waiting('等候当前消息变量就绪');
  }

  const calendarNow = readValueAtPath(variables, 'calendar.now');
  const weekAnchorValue = readValueAtPath(variables, 'calendar.weekAnchor');

  if (calendarNow === undefined || calendarNow === null ||
      weekAnchorValue === undefined || weekAnchorValue === null) {
    return waiting('等待 calendar.now 与 calendar.weekAnchor 初始化');
  }

  const currentPoint = parseStructuredCalendarPoint(calendarNow);
  const weekAnchor = parseCalendarWeekAnchor(weekAnchorValue);
  if (!currentPoint || !weekAnchor) {
    return waiting('历法变量格式不完整，请检查 calendar.now / calendar.weekAnchor');
  }

  if (weekAnchor.weekday > 6) {
    return waiting('当前 ST 入口使用七日制，weekAnchor.weekday 必须为 0–6');
  }
  try {
    assertValidCalendarDate(currentPoint.date);
    assertValidCalendarDate(weekAnchor.date);
  } catch {
    return waiting('历法变量中的年月日无效');
  }

  return {
    ready: true,
    currentDate: { ...currentPoint.date },
    weekAnchor,
  };
}
