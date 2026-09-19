import {
  createApp,
  defineComponent,
  h,
  ref,
  shallowRef,
  type App,
} from 'vue';

import {
  CalendarMonthSession,
  type CalendarDate,
  type CalendarMonthViewModel,
} from '../../ui';
import { CalendarMonthView } from './month-view';
import { CALENDAR_MONTH_VIEW_CSS } from './styles';

export interface MountVueCalendarMonthOptions {
  session: CalendarMonthSession;
  weekdayLabels?: readonly string[];
  maxVisibleOccurrences?: number;
  onSelectedDateChange?: (date: CalendarDate) => void;
}

export interface MountedVueCalendarMonth {
  refresh(): Promise<CalendarMonthViewModel>;
  destroy(): void;
}

export async function mountVueCalendarMonth(
  container: HTMLElement,
  options: MountVueCalendarMonthOptions,
): Promise<MountedVueCalendarMonth> {
  const initial = await options.session.load();
  const model = shallowRef(initial);
  const busy = ref(false);

  let app: App<Element> | null = null;

  const Root = defineComponent({
    name: 'CalendarMonthRendererRoot',

    setup() {
      const navigate = async (delta: number) => {
        if (busy.value) {
          return;
        }

        busy.value = true;
        try {
          model.value =
            await options.session.navigateMonths(delta);
        } finally {
          busy.value = false;
        }
      };

      const selectDate = (date: CalendarDate) => {
        model.value = options.session.selectDate(date);
        options.onSelectedDateChange?.(date);
      };

      return () =>
        h(CalendarMonthView, {
          model: model.value,
          weekdayLabels: options.weekdayLabels,
          maxVisibleOccurrences:
            options.maxVisibleOccurrences,
          busy: busy.value,
          onPreviousMonth: () => void navigate(-1),
          onNextMonth: () => void navigate(1),
          onSelectDate: selectDate,
        });
    },
  });

  const style = container.ownerDocument.createElement('style');
  style.dataset.calendarCoreRenderer = 'vue-month';
  style.textContent = CALENDAR_MONTH_VIEW_CSS;

  const mountPoint =
    container.ownerDocument.createElement('div');
  mountPoint.dataset.calendarCoreMount = 'vue-month';

  container.replaceChildren(style, mountPoint);

  app = createApp(Root);
  app.mount(mountPoint);

  return {
    async refresh() {
      model.value = await options.session.load();
      return model.value;
    },

    destroy() {
      app?.unmount();
      app = null;
      container.replaceChildren();
    },
  };
}
