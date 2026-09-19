import {
  formatCalendarDateKey,
  type CalendarDate,
  type CalendarOccurrence,
  type CalendarPoint,
} from '../core';
import type {
  CalendarDayOccurrenceView,
  CalendarDayViewModel,
} from './types';

function clonePoint(point: CalendarPoint): CalendarPoint {
  return {
    date: { ...point.date },
    ...(point.time
      ? { time: { ...point.time } }
      : {}),
  };
}

function buildOccurrenceView(
  occurrence: CalendarOccurrence,
): CalendarDayOccurrenceView {
  return {
    key: [
      occurrence.event.moduleId,
      occurrence.event.id,
      occurrence.occurrenceIndex,
    ].join(':'),
    eventId: occurrence.event.id,
    occurrenceIndex: occurrence.occurrenceIndex,
    moduleId: occurrence.event.moduleId,
    kind: occurrence.event.kind,
    title: occurrence.event.title,
    allDay:
      occurrence.event.allDay ??
      !occurrence.start.time,
    start: clonePoint(occurrence.start),
    ...(occurrence.end
      ? { end: clonePoint(occurrence.end) }
      : {}),
    tags: [...(occurrence.event.tags ?? [])],
  };
}

export function buildCalendarDayViewModel(
  date: CalendarDate,
  occurrences: readonly CalendarOccurrence[],
  isToday = false,
): CalendarDayViewModel {
  return {
    key: formatCalendarDateKey(date),
    date: { ...date },
    isToday,
    occurrences: occurrences.map(buildOccurrenceView),
  };
}
