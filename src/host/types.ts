import type { CalendarTimeSource } from '../app';

export interface CalendarHost {
  readonly id: string;
  readonly time: CalendarTimeSource;
}
