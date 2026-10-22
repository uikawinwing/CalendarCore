import {
  createGlobalSillyTavernRuntime,
} from '../host/sillytavern';
import {
  anniversaryAdapter,
  appointmentAdapter,
  birthdayAdapter,
  classAdapter,
  eventAdapter,
  festivalAdapter,
  historyAdapter,
  reminderAdapter,
  parseAnniversaryDefinitions,
  parseAppointmentDefinitions,
  parseBirthdayDefinitions,
  parseClassDefinitions,
  parseEventDefinitions,
  parseFestivalDefinitions,
  parseHistoryDefinitions,
  parseReminderDefinitions,
} from '../modules';
import {
  SillyTavernCalendarBridge,
  mountSillyTavernCalendarShell,
} from '../integrations/sillytavern';
import { inspectSillyTavernCalendarReadiness } from '../integrations/sillytavern/readiness';

interface CalendarCoreRuntimeHandle {
  destroy(): void;
  refresh(): Promise<unknown>;
}

declare global {
  interface Window {
    CalendarCoreRuntime?: CalendarCoreRuntimeHandle;
  }
}

/**
 * Mount a visible, inert shell first. The real game calendar is loaded only
 * after the world-date variables have arrived. Never initialize or overwrite
 * story state from a viewer component.
 */
async function bootstrap(): Promise<void> {
  window.CalendarCoreRuntime?.destroy();

  const shell = await mountSillyTavernCalendarShell({
    pendingMessage: '等待 calendar.now 与 calendar.weekAnchor 初始化',
    buttonLabel: '📅',
    buttonTitle: 'Calendar',
    weekdayLabels: ['日', '一', '二', '三', '四', '五', '六'],
  });
  let disposed = false;
  let initialized = false;
  let initializing = false;
  let retryInterval: number | undefined;
  let lastUnexpectedError = '';

  const initialize = async () => {
    if (disposed || initialized || initializing) return;
    initializing = true;
    try {
      let runtime: ReturnType<typeof createGlobalSillyTavernRuntime>;
      try {
        runtime = createGlobalSillyTavernRuntime();
      } catch {
        shell.showPending('等待 SillyTavern 消息变量接口就绪');
        return;
      }

      const readiness = inspectSillyTavernCalendarReadiness(runtime);
      if (!readiness.ready) {
        shell.showPending(readiness.message);
        return;
      }

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
    adapter: classAdapter,
    path: 'calendar.modules.class',
    parser: parseClassDefinitions,
  });

  bridge.registerModule({
    adapter: reminderAdapter,
    path: 'calendar.modules.reminder',
    parser: parseReminderDefinitions,
  });

  bridge.registerModule({
    adapter: historyAdapter,
    path: 'calendar.modules.history',
    parser: parseHistoryDefinitions,
  });

  bridge.registerModule({
    adapter: festivalAdapter,
    path: 'calendar.modules.festival',
    parser: parseFestivalDefinitions,
  });

      const session = await bridge.createMonthSession({
        weekAnchor: readiness.weekAnchor,
        selectedDate: readiness.currentDate,
      });
      await shell.activateSession(session);
      if (disposed) return;
      initialized = true;
      if (retryInterval !== undefined) {
        window.clearInterval(retryInterval);
        retryInterval = undefined;
      }
    } catch (error) {
      // Report genuine module/runtime errors once; do not terminate the shell.
      const message = error instanceof Error ? error.message : String(error);
      shell.showPending('历法数据已读取，但日历加载失败：' + message);
      if (lastUnexpectedError !== message) {
        console.warn('[CalendarCore] Waiting to recover from initialization error', error);
        lastUnexpectedError = message;
      }
    } finally {
      initializing = false;
    }
  };

  const handle: CalendarCoreRuntimeHandle = {
    destroy: () => {
      if (disposed) return;
      disposed = true;
      if (retryInterval !== undefined) window.clearInterval(retryInterval);
      shell.destroy();
      if (window.CalendarCoreRuntime === handle) delete window.CalendarCoreRuntime;
    },
    refresh: async () => {
      if (!initialized) await initialize();
      return shell.refresh();
    },
  };
  window.CalendarCoreRuntime = handle;
  // A new ST chat may have no latest message at all. Keep a light retry active
  // only until the variables are ready, then remove it.
  retryInterval = window.setInterval(() => void initialize(), 2000);
  await initialize();
}

void bootstrap().catch(error => {
  console.error('[CalendarCore] Failed to mount calendar shell', error);
});
