import {
  CalendarRegistry,
  gregorianCalendarSystem,
  projectCalendarDays,
  queryCalendarOccurrences,
  type CalendarDateRange,
  type CalendarEvent,
  type CalendarSystem,
} from '../core';
import type {
  CalendarModuleBinding,
  CalendarTimeSource,
} from './ports';
import type { CalendarAppSnapshot } from './types';

export interface CalendarAppOptions {
  timeSource: CalendarTimeSource;
  calendarSystem?: CalendarSystem;
}

export class CalendarApp {
  private readonly registry = new CalendarRegistry();
  private readonly loaders = new Map<string, () => Promise<CalendarEvent[]>>();
  private readonly timeSource: CalendarTimeSource;
  private readonly calendarSystem: CalendarSystem;

  constructor(options: CalendarAppOptions) {
    this.timeSource = options.timeSource;
    this.calendarSystem = options.calendarSystem ?? gregorianCalendarSystem;
  }

  registerModule<TInput>(binding: CalendarModuleBinding<TInput>): void {
    const moduleId = binding.adapter.moduleId;

    if (this.loaders.has(moduleId)) {
      throw new Error(`Calendar app module already registered: ${moduleId}`);
    }

    this.registry.register(binding.adapter);
    this.loaders.set(moduleId, async () => {
      const input = await binding.source.load();
      return input.flatMap(value => this.registry.normalize(moduleId, value));
    });
  }

  hasModule(moduleId: string): boolean {
    return this.loaders.has(moduleId);
  }

  async loadEvents(): Promise<CalendarEvent[]> {
    const batches = await Promise.all(
      [...this.loaders.values()].map(load => load()),
    );

    return batches.flat();
  }

  async buildSnapshot(range: CalendarDateRange): Promise<CalendarAppSnapshot> {
    const [now, events] = await Promise.all([
      this.timeSource.getCurrentPoint(),
      this.loadEvents(),
    ]);

    const occurrences = queryCalendarOccurrences(
      events,
      range,
      this.calendarSystem,
    );

    return {
      now,
      range,
      events,
      occurrences,
      days: projectCalendarDays(
        occurrences,
        range,
        this.calendarSystem,
      ),
    };
  }
}
