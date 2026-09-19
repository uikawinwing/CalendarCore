import type {
  CalendarModuleAdapter,
  CalendarPoint as CoreCalendarPoint,
} from '../core';

export type { CalendarPoint } from '../core';

export type Awaitable<T> = T | Promise<T>;

export interface CalendarTimeSource {
  getCurrentPoint(): Awaitable<CoreCalendarPoint>;
}

export interface CalendarModuleSource<TInput> {
  load(): Awaitable<readonly TInput[]>;
}

export interface CalendarModuleBinding<TInput> {
  adapter: CalendarModuleAdapter<TInput>;
  source: CalendarModuleSource<TInput>;
}
