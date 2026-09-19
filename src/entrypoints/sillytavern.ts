import {
  createGlobalSillyTavernRuntime,
  readValueAtPath,
} from '../host/sillytavern';
import {
  anniversaryAdapter,
  appointmentAdapter,
  birthdayAdapter,
  eventAdapter,
  festivalAdapter,
  parseAnniversaryDefinitions,
  parseAppointmentDefinitions,
  parseBirthdayDefinitions,
  parseEventDefinitions,
  parseFestivalDefinitions,
} from '../modules';
import {
  SillyTavernCalendarBridge,
  mountSillyTavernCalendarShell,
  parseCalendarWeekAnchor,
} from '../integrations/sillytavern';

interface CalendarCoreRuntimeHandle {
  destroy(): void;
  refresh(): Promise<unknown>;
}

declare global {
  interface Window {
    CalendarCoreRuntime?: CalendarCoreRuntimeHandle;
  }
}

async function bootstrap(): Promise<void> {
  window.CalendarCoreRuntime?.destroy();

  const runtime = createGlobalSillyTavernRuntime();
  const bridge = new SillyTavernCalendarBridge({
    runtime,
    timePath: 'calendar.now',
  });

  bridge.registerModule({
    adapter: eventAdapter,
    path: 'calendar.modules.event',
    parser: parseEventDefinitions,
  });

  bridge.registerModule({
    adapter: appointmentAdapter,
    path: 'calendar.modules.appointment',
    parser: parseAppointmentDefinitions,
  });

  bridge.registerModule({
    adapter: birthdayAdapter,
    path: 'calendar.modules.birthday',
    parser: parseBirthdayDefinitions,
  });

  bridge.registerModule({
    adapter: anniversaryAdapter,
    path: 'calendar.modules.anniversary',
    parser: parseAnniversaryDefinitions,
  });

  bridge.registerModule({
    adapter: festivalAdapter,
    path: 'calendar.modules.festival',
    parser: parseFestivalDefinitions,
  });

  const variables = bridge.reader.readLatest();
  const weekAnchor = parseCalendarWeekAnchor(
    readValueAtPath(variables, 'calendar.weekAnchor'),
  );

  if (!weekAnchor) {
    throw new Error(
      'CalendarCore requires a valid calendar.weekAnchor in latest message variables',
    );
  }

  const currentDate = await bridge.getCurrentDate();
  const session = await bridge.createMonthSession({
    weekAnchor,
    selectedDate: currentDate,
  });

  const shell = await mountSillyTavernCalendarShell({
    session,
    buttonLabel: '📅',
    buttonTitle: 'Calendar',
    weekdayLabels: ['日', '一', '二', '三', '四', '五', '六'],
  });

  window.CalendarCoreRuntime = {
    destroy: () => shell.destroy(),
    refresh: () => shell.refresh(),
  };
}

void bootstrap().catch(error => {
  console.error('[CalendarCore] Failed to start', error);
});
