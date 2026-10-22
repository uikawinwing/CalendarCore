import {
  computed,
  defineComponent,
  h,
  nextTick,
  ref,
  watch,
  type PropType,
} from 'vue';

import type {
  CalendarDate,
  CalendarDayOccurrenceView,
  CalendarDayViewModel,
  CalendarMonthCell,
  CalendarMonthViewModel,
} from '../../ui';

const MODULE_LABELS: Record<string, string> = {
  festival: '节庆',
  event: '事件',
  appointment: '邀约',
  class: '课程',
  reminder: '提醒',
  birthday: '生日',
  anniversary: '纪念',
  history: '历史',
};

function defaultWeekdayLabels(columns: number): string[] {
  return Array.from({ length: columns }, (_, index) => String(index + 1));
}

function clock(time: CalendarDayOccurrenceView['start']['time']): string {
  if (!time) return '';
  return String(time.hour).padStart(2, '0') + ':' + String(time.minute).padStart(2, '0');
}

function sameDate(a: CalendarDate, b: CalendarDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

function formatTime(occurrence: CalendarDayOccurrenceView): string {
  if (occurrence.allDay) return '全天';
  const start = clock(occurrence.start.time);
  const end = clock(occurrence.end?.time);
  if (occurrence.end && sameDate(occurrence.start.date, occurrence.end.date) && start && end) {
    return start + '–' + end;
  }
  if (occurrence.end && !sameDate(occurrence.start.date, occurrence.end.date)) {
    return '跨日 · ' + (start || '定时');
  }
  return start || '定时';
}

function fullPoint(point: CalendarDayOccurrenceView['start']): string {
  const day = point.date.year + '年' + point.date.month + '月' + point.date.day + '日';
  return day + (point.time ? ' ' + clock(point.time) : '');
}

function renderOccurrences(cell: CalendarMonthCell, maxVisibleOccurrences: number) {
  const visible = cell.occurrences.slice(0, maxVisibleOccurrences);
  const overflow = cell.occurrences.length - visible.length;
  return h('span', { class: 'cc-month-cell__events', 'aria-hidden': 'true' }, [
    ...visible.map(occurrence =>
      h(
        'span',
        {
          class: 'cc-month-event',
          key: occurrence.event.moduleId + ':' + occurrence.event.id,
          title: occurrence.event.title,
          'data-module-id': occurrence.event.moduleId,
          'data-event-kind': occurrence.event.kind,
        },
        occurrence.event.title,
      ),
    ),
    ...(overflow > 0
      ? [h('span', { class: 'cc-month-event cc-month-event--overflow' }, '+' + overflow)]
      : []),
  ]);
}

function renderDayOccurrence(
  occurrence: CalendarDayOccurrenceView,
  onOpen: (occurrence: CalendarDayOccurrenceView, event: MouseEvent) => void,
) {
  return h(
    'button',
    {
      key: occurrence.key,
      type: 'button',
      class: 'cc-day-detail__event',
      'data-detail-event-id': occurrence.eventId,
      'data-module-id': occurrence.moduleId,
      'data-event-kind': occurrence.kind,
      'aria-label': '查看事件详情：' + occurrence.title,
      onClick: (event: MouseEvent) => onOpen(occurrence, event),
    },
    [
      h('span', { class: 'cc-day-detail__event-mark', 'aria-hidden': 'true' }),
      h('span', { class: 'cc-day-detail__event-content' }, [
        h('span', { class: 'cc-day-detail__event-title' }, occurrence.title),
        h('span', { class: 'cc-day-detail__event-topline' }, [
          h('span', { class: 'cc-day-detail__time' }, formatTime(occurrence)),
          h(
            'span',
            { class: 'cc-day-detail__module' },
            MODULE_LABELS[occurrence.moduleId] ?? occurrence.moduleId,
          ),
        ]),
      ]),
      h('span', { class: 'cc-day-detail__event-arrow', 'aria-hidden': 'true' }, '›'),
    ],
  );
}

function renderDayDetail(
  day: CalendarDayViewModel | undefined,
  weekdayLabel: string,
  onOpen: (occurrence: CalendarDayOccurrenceView, event: MouseEvent) => void,
) {
  return h(
    'section',
    {
      class: 'cc-day-detail',
      'aria-label': '选中日议程',
      'aria-live': 'polite',
      ...(day ? { 'data-day-detail-date': day.key } : {}),
    },
    [
      h('header', { class: 'cc-day-detail__header' }, [
        h('div', { class: 'cc-day-detail__heading' }, [
          h('div', { class: 'cc-day-detail__eyebrow' }, '当日议程'),
          h('h3', { class: 'cc-day-detail__title' }, day
            ? day.date.day + '日 · ' + weekdayLabel
            : '选择日期'),
        ]),
        ...(day?.isToday ? [h('span', { class: 'cc-day-detail__today' }, '今天')] : []),
        ...(day && day.occurrences.length >= 4
          ? [h('span', { class: 'cc-day-detail__count' }, day.occurrences.length + ' 项')]
          : []),
      ]),
      day?.occurrences.length
        ? h('div', { class: 'cc-day-detail__events' }, day.occurrences.map(occ => renderDayOccurrence(occ, onOpen)))
        : h('div', { class: 'cc-day-detail__empty-state' }, day ? '当天暂无事件' : '选择日期查看事件'),
    ],
  );
}

export const CalendarMonthView = defineComponent({
  name: 'CalendarMonthView',

  props: {
    model: {
      type: Object as PropType<CalendarMonthViewModel>,
      required: true,
    },
    weekdayLabels: {
      type: Array as PropType<readonly string[]>,
      default: () => [],
    },
    maxVisibleOccurrences: {
      type: Number,
      default: 3,
    },
    busy: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    selectDate: (_date: CalendarDate) => true,
    clearSelection: () => true,
    previousMonth: () => true,
    nextMonth: () => true,
    previousDay: () => true,
    nextDay: () => true,
    goToday: () => true,
  },

  setup(props, { emit }) {
    const expanded = ref(false);
    const activeOccurrenceKey = ref<string | null>(null);
    const sheetElement = ref<HTMLElement | null>(null);
    let focusReturnElement: HTMLElement | null = null;

    const labels = computed(() => {
      const provided = [...props.weekdayLabels];
      return provided.length === props.model.columns
        ? provided
        : defaultWeekdayLabels(props.model.columns);
    });

    const selectedIndex = computed(() => {
      const index = props.model.cells.findIndex(cell => cell.isSelected);
      if (index >= 0) return index;
      const today = props.model.cells.findIndex(cell => cell.isToday);
      if (today >= 0) return today;
      return props.model.cells.findIndex(cell => cell.inCurrentMonth);
    });

    const selectedWeek = computed(() =>
      Math.floor(Math.max(0, selectedIndex.value) / props.model.columns),
    );

    const selectedWeekday = computed(() => {
      const index = selectedIndex.value;
      if (index < 0) return '';
      return labels.value[index % props.model.columns] ?? '';
    });

    const activeOccurrence = computed(() =>
      props.model.selectedDay?.occurrences.find(item => item.key === activeOccurrenceKey.value),
    );

    const closeSheet = () => {
      activeOccurrenceKey.value = null;
      const target = focusReturnElement;
      focusReturnElement = null;
      if (target) void nextTick(() => target.isConnected && target.focus());
    };

    const openSheet = (occurrence: CalendarDayOccurrenceView, event: MouseEvent) => {
      focusReturnElement = event.currentTarget as HTMLElement;
      activeOccurrenceKey.value = occurrence.key;
      void nextTick(() => sheetElement.value?.querySelector<HTMLButtonElement>('.cc-event-sheet__close')?.focus());
    };

    watch(() => props.model.selectedDay?.key, () => {
      activeOccurrenceKey.value = null;
      focusReturnElement = null;
    });

    const handleSheetKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeSheet();
      } else if (event.key === 'Tab') {
        // The detail sheet has one focusable control. Keep focus inside it.
        event.preventDefault();
        sheetElement.value?.querySelector<HTMLButtonElement>('.cc-event-sheet__close')?.focus();
      }
    };

    return () => h(
      'section',
      {
        class: 'cc-calendar-month',
        'aria-label': props.model.year + '-' + props.model.month,
        'data-expanded': expanded.value ? 'true' : 'false',
      },
      [
        h('header', { class: 'cc-calendar-month__header' }, [
          h('div', { class: 'cc-calendar-month__month-switcher' }, [
            h('button', {
              type: 'button',
              class: 'cc-calendar-month__nav',
              disabled: props.busy,
              'aria-label': 'Previous month',
              title: '上个月',
              onClick: () => emit('previousMonth'),
            }, '‹'),
            h('h2', { class: 'cc-calendar-month__title' }, props.model.year + ' 年 ' + props.model.month + ' 月'),
            h('button', {
              type: 'button',
              class: 'cc-calendar-month__nav',
              disabled: props.busy,
              'aria-label': 'Next month',
              title: '下个月',
              onClick: () => emit('nextMonth'),
            }, '›'),
          ]),
          h('div', { class: 'cc-calendar-month__header-actions' }, [
            ...(!props.model.selectedDay?.isToday
              ? [h('button', {
                  type: 'button',
                  class: 'cc-calendar-month__today-link',
                  disabled: props.busy,
                  'aria-label': '返回世界今天',
                  onClick: () => emit('goToday'),
                }, '回今天')]
              : []),
          ]),
        ]),
        h('div', { class: 'cc-calendar-month__body' }, [
          h('section', { class: 'cc-calendar-month__calendar', 'aria-label': '日历网格' }, [
            h('div', {
              class: 'cc-calendar-month__weekdays',
              style: { '--cc-calendar-columns': String(props.model.columns) },
            }, labels.value.map((label, index) =>
              h('span', {
                key: index,
                class: 'cc-calendar-month__weekday',
                'data-weekday': index,
              }, label),
            )),
            h('div', {
              class: 'cc-calendar-month__grid',
              id: 'cc-calendar-grid',
              style: { '--cc-calendar-columns': String(props.model.columns) },
            }, props.model.cells.map((cell, index) =>
              h('button', {
                key: cell.key,
                type: 'button',
                class: [
                  'cc-month-cell',
                  {
                    'cc-month-cell--outside': !cell.inCurrentMonth,
                    'cc-month-cell--today': cell.isToday,
                    'cc-month-cell--selected': cell.isSelected,
                    'cc-month-cell--active-week': Math.floor(index / props.model.columns) === selectedWeek.value,
                  },
                ],
                'data-calendar-date': cell.key,
                'aria-label': cell.date.day + '日，' + cell.occurrences.length + '项事件',
                'aria-pressed': cell.isSelected ? 'true' : 'false',
                onClick: () => emit('selectDate', cell.date),
              }, [
                h('span', { class: 'cc-month-cell__day' }, String(cell.date.day)),
                renderOccurrences(cell, Math.max(0, Math.floor(props.maxVisibleOccurrences))),
              ]),
            )),
            h('button', {
              type: 'button',
              class: 'cc-calendar-month__fold',
              'aria-controls': 'cc-calendar-grid',
              'aria-expanded': expanded.value ? 'true' : 'false',
              onClick: () => { expanded.value = !expanded.value; },
            }, expanded.value ? '收起月历 ⌃' : '展开月历 ⌄'),
          ]),
          renderDayDetail(props.model.selectedDay, selectedWeekday.value, openSheet),
        ]),
        h('nav', { class: 'cc-calendar-month__bottom-nav', 'aria-label': '日期快捷导航' }, [
          h('button', {
            type: 'button',
            disabled: props.busy,
            'aria-label': '前一天',
            onClick: () => emit('previousDay'),
          }, '‹ 前一天'),
          h('button', {
            type: 'button',
            disabled: props.busy,
            'aria-label': expanded.value ? '收起月历' : '展开月历',
            onClick: () => { expanded.value = !expanded.value; },
          }, expanded.value ? '收起月历' : '月历'),
          h('button', {
            type: 'button',
            disabled: props.busy,
            'aria-label': '后一天',
            onClick: () => emit('nextDay'),
          }, '后一天 ›'),
        ]),
        ...(activeOccurrence.value ? [h('div', {
          class: 'cc-event-sheet',
          ref: sheetElement,
          role: 'dialog',
          'aria-modal': 'true',
          'aria-label': '事件详情',
          onClick: (event: MouseEvent) => {
            if (event.target === event.currentTarget) closeSheet();
          },
          onKeydown: handleSheetKeydown,
        }, [
          h('article', { class: 'cc-event-sheet__card' }, [
            h('header', { class: 'cc-event-sheet__header' }, [
              h('span', {}, '事件详情'),
              h('button', {
                type: 'button',
                class: 'cc-event-sheet__close',
                onClick: closeSheet,
              }, '返回列表 ×'),
            ]),
            h('div', { class: 'cc-event-sheet__content' }, [
              h('h3', { class: 'cc-event-sheet__title' }, activeOccurrence.value.title),
              h('dl', { class: 'cc-event-sheet__fields' }, [
                h('dt', {}, '时间'),
                h('dd', {}, formatTime(activeOccurrence.value)),
                h('dt', {}, '开始'),
                h('dd', {}, fullPoint(activeOccurrence.value.start)),
                ...(activeOccurrence.value.end ? [
                  h('dt', {}, '结束'),
                  h('dd', {}, fullPoint(activeOccurrence.value.end)),
                ] : []),
                h('dt', {}, '类别'),
                h('dd', {}, MODULE_LABELS[activeOccurrence.value.moduleId] ?? activeOccurrence.value.moduleId),
                ...(activeOccurrence.value.tags.length ? [
                  h('dt', {}, '标签'),
                  h('dd', {}, activeOccurrence.value.tags.join(' · ')),
                ] : []),
              ]),
            ]),
          ]),
        ])] : []),
      ],
    );
  },
});
