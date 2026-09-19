import type {
  CalendarDate,
  CalendarEvent,
  CalendarModuleAdapter,
} from '../../core';
import type {
  FestivalDefinition,
  FestivalMonthDay,
  FestivalStageDefinition,
} from './types';

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${label} must be a positive integer`);
  }
}

function compareMonthDay(left: FestivalMonthDay, right: FestivalMonthDay): number {
  return left.month - right.month || left.day - right.day;
}

function toDate(monthDay: FestivalMonthDay, year: number): CalendarDate {
  assertPositiveInteger(year, 'festival anchorYear');
  assertPositiveInteger(monthDay.month, 'festival month');
  assertPositiveInteger(monthDay.day, 'festival day');

  return {
    year,
    month: monthDay.month,
    day: monthDay.day,
  };
}

function buildRange(
  start: FestivalMonthDay,
  end: FestivalMonthDay | undefined,
  anchorYear: number,
): Pick<CalendarEvent, 'start' | 'end'> {
  const resolvedEnd = end ?? start;
  const endYear = compareMonthDay(resolvedEnd, start) < 0
    ? anchorYear + 1
    : anchorYear;

  return {
    start: { date: toDate(start, anchorYear) },
    end: { date: toDate(resolvedEnd, endYear) },
  };
}

function buildRecurrence(
  repeatEveryYears: number | null,
): CalendarEvent['recurrence'] {
  if (repeatEveryYears === null) {
    return undefined;
  }

  assertPositiveInteger(repeatEveryYears, 'festival repeatEveryYears');
  return {
    frequency: 'yearly',
    interval: repeatEveryYears,
  };
}

function buildStageEvent(
  festival: FestivalDefinition,
  stage: FestivalStageDefinition,
): CalendarEvent {
  const anchorYear = stage.anchorYear ?? festival.anchorYear;
  const repeatEveryYears = stage.repeatEveryYears === undefined
    ? festival.repeatEveryYears
    : stage.repeatEveryYears;
  const stageRecurrence = buildRecurrence(repeatEveryYears);

  return {
    id: `${festival.id}:stage:${stage.id}`,
    moduleId: 'festival',
    kind: 'festival-stage',
    title: `${festival.title} · ${stage.title}`,
    ...buildRange(stage.start, stage.end, anchorYear),
    allDay: true,
    ...(stageRecurrence ? { recurrence: stageRecurrence } : {}),
    tags: ['festival', 'festival-stage'],
    payload: {
      role: 'stage',
      festivalId: festival.id,
      stageId: stage.id,
      stageTitle: stage.title,
      summary: stage.summary ?? '',
      metadata: stage.metadata ?? {},
    },
  };
}

export const festivalAdapter: CalendarModuleAdapter<FestivalDefinition> = {
  moduleId: 'festival',

  normalize(festival) {
    const eventRecurrence = buildRecurrence(festival.repeatEveryYears);
    const baseEvent: CalendarEvent = {
      id: festival.id,
      moduleId: this.moduleId,
      kind: 'festival',
      title: festival.title,
      ...buildRange(festival.start, festival.end, festival.anchorYear),
      allDay: true,
      ...(eventRecurrence ? { recurrence: eventRecurrence } : {}),
      tags: ['festival', ...(festival.tags ?? [])],
      payload: {
        role: 'festival',
        summary: festival.summary ?? '',
        relatedBookIds: [...(festival.relatedBookIds ?? [])],
        locationKeywords: [...(festival.locationKeywords ?? [])],
        metadata: festival.metadata ?? {},
      },
    };

    return [
      baseEvent,
      ...(festival.stages ?? []).map(stage => buildStageEvent(festival, stage)),
    ];
  },
};
