import { CalendarApp } from '../../app';
import {
  gregorianCalendarSystem,
  type CalendarDate,
  type CalendarModuleAdapter,
  type CalendarSystem,
  type CalendarWeekAnchor,
} from '../../core';
import {
  SillyTavernMessageModuleSource,
  SillyTavernMessageTimeSource,
  SillyTavernMessageVariableReader,
  type CalendarModuleInputParser,
  type CalendarTimeParser,
  type SillyTavernRuntime,
} from '../../host/sillytavern';
import { CalendarMonthSession } from '../../ui';

export interface SillyTavernCalendarBridgeOptions {
  runtime: SillyTavernRuntime;
  timePath: string | readonly string[];
  timeParser?: CalendarTimeParser;
  calendarSystem?: CalendarSystem;
}

export interface SillyTavernModuleRegistration<TInput> {
  adapter: CalendarModuleAdapter<TInput>;
  path: string | readonly string[];
  parser: CalendarModuleInputParser<TInput>;
}

export interface CreateSillyTavernMonthSessionOptions {
  weekAnchor: CalendarWeekAnchor;
  weekStartsOn?: number;
  initialMonth?: Pick<CalendarDate, 'year' | 'month'>;
  selectedDate?: CalendarDate;
}

export class SillyTavernCalendarBridge {
  readonly app: CalendarApp;
  readonly reader: SillyTavernMessageVariableReader;

  private readonly timeSource: SillyTavernMessageTimeSource;
  private readonly calendarSystem: CalendarSystem;

  constructor(options: SillyTavernCalendarBridgeOptions) {
    this.reader = new SillyTavernMessageVariableReader(
      options.runtime,
    );
    this.timeSource = new SillyTavernMessageTimeSource({
      reader: this.reader,
      path: options.timePath,
      parser: options.timeParser,
    });
    this.calendarSystem =
      options.calendarSystem ?? gregorianCalendarSystem;

    this.app = new CalendarApp({
      timeSource: this.timeSource,
      calendarSystem: this.calendarSystem,
    });
  }

  registerModule<TInput>(
    registration: SillyTavernModuleRegistration<TInput>,
  ): void {
    this.app.registerModule({
      adapter: registration.adapter,
      source: new SillyTavernMessageModuleSource<TInput>({
        reader: this.reader,
        path: registration.path,
        parser: registration.parser,
      }),
    });
  }

  async getCurrentDate(): Promise<CalendarDate> {
    const point = await this.timeSource.getCurrentPoint();
    return { ...point.date };
  }

  async createMonthSession(
    options: CreateSillyTavernMonthSessionOptions,
  ): Promise<CalendarMonthSession> {
    const initialMonth =
      options.initialMonth ??
      (await this.getCurrentDate());

    return new CalendarMonthSession({
      app: this.app,
      initialMonth: {
        year: initialMonth.year,
        month: initialMonth.month,
      },
      weekAnchor: options.weekAnchor,
      weekStartsOn: options.weekStartsOn,
      calendarSystem: this.calendarSystem,
      selectedDate: options.selectedDate,
    });
  }
}
