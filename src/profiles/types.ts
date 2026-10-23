import type { CalendarDate, CalendarWeekAnchor } from '../core';
import type { CalendarTimeParser } from '../host/sillytavern';

/** Read-only host profile. An author can supply another profile without modifying Core. */
export interface CalendarProfileMatch {
  readonly profileId: string;
  readonly timePath: string;
  readonly timeParser: CalendarTimeParser;
  readonly currentDate: CalendarDate;
  readonly weekAnchor: CalendarWeekAnchor;
}

export interface CalendarProfile {
  readonly id: string;
  readonly label: string;
  /** Return null for unrelated/incomplete MVU data. Never write game variables. */
  match(variables: Readonly<Record<string, unknown>>): CalendarProfileMatch | null;
  /** Only report malformed values of a known source, never infer event actions. */
  diagnostic?(variables: Readonly<Record<string, unknown>>): string | null;
}
