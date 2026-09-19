import {
  computed,
  defineComponent,
  h,
  type PropType,
} from 'vue';

import type {
  CalendarDate,
  CalendarDayOccurrenceView,
  CalendarDayViewModel,
  CalendarMonthCell,
  CalendarMonthViewModel,
} from '../../ui';

function defaultWeekdayLabels(columns: number): string[] {
  return Array.from(
    { length: columns },
    (_, index) => String(index + 1),
  );
}

function renderOccurrences(
  cell: CalendarMonthCell,
  maxVisibleOccurrences: number,
) {
  const visible = cell.occurrences.slice(
    0,
    maxVisibleOccurrences,
  );
  const overflow =
    cell.occurrences.length - visible.length;

  return h(
    'div',
    { class: 'cc-month-cell__events' },
    [
      ...visible.map(occurrence =>
        h(
          'div',
          {
            class: 'cc-month-event',
            title: occurrence.event.title,
            'data-module-id': occurrence.event.moduleId,
            'data-event-kind': occurrence.event.kind,
          },
          occurrence.event.title,
        ),
      ),
      ...(overflow > 0
        ? [
            h(
              'div',
              {
                class:
                  'cc-month-event cc-month-event--overflow',
              },
              `+${overflow}`,
            ),
          ]
        : []),
    ],
  );
}

function formatClock(
  time: CalendarDayOccurrenceView['start']['time'],
): string {
  if (!time) {
    return '';
  }

  const pad = (value: number) =>
    String(value).padStart(2, '0');

  return `${pad(time.hour)}:${pad(time.minute)}`;
}

function formatOccurrenceTime(
  occurrence: CalendarDayOccurrenceView,
): string {
  if (occurrence.allDay) {
    return 'All day';
  }

  const start = formatClock(occurrence.start.time);
  const end = formatClock(occurrence.end?.time);

  if (
    start &&
    end &&
    occurrence.end &&
    occurrence.start.date.year === occurrence.end.date.year &&
    occurrence.start.date.month === occurrence.end.date.month &&
    occurrence.start.date.day === occurrence.end.date.day
  ) {
    return `${start}–${end}`;
  }

  return start || 'Timed event';
}

function renderDayOccurrence(
  occurrence: CalendarDayOccurrenceView,
) {
  return h(
    'article',
    {
      key: occurrence.key,
      class: 'cc-day-detail__event',
      'data-detail-event-id': occurrence.eventId,
      'data-module-id': occurrence.moduleId,
      'data-event-kind': occurrence.kind,
    },
    [
      h(
        'div',
        { class: 'cc-day-detail__event-topline' },
        [
          h(
            'span',
            { class: 'cc-day-detail__time' },
            formatOccurrenceTime(occurrence),
          ),
          h(
            'span',
            { class: 'cc-day-detail__module' },
            occurrence.moduleId,
          ),
        ],
      ),
      h(
        'div',
        { class: 'cc-day-detail__event-title' },
        occurrence.title,
      ),
    ],
  );
}

function renderDayDetail(
  day: CalendarDayViewModel | undefined,
) {
  if (!day) {
    return h(
      'aside',
      {
        class: 'cc-day-detail cc-day-detail--empty',
        'aria-live': 'polite',
      },
      'Select a day',
    );
  }

  return h(
    'aside',
    {
      class: 'cc-day-detail',
      'aria-live': 'polite',
      'data-day-detail-date': day.key,
    },
    [
      h(
        'header',
        { class: 'cc-day-detail__header' },
        [
          h(
            'h3',
            { class: 'cc-day-detail__title' },
            `${day.date.year} / ${day.date.month} / ${day.date.day}`,
          ),
          ...(day.isToday
            ? [
                h(
                  'span',
                  { class: 'cc-day-detail__today' },
                  'Today',
                ),
              ]
            : []),
        ],
      ),
      day.occurrences.length > 0
        ? h(
            'div',
            { class: 'cc-day-detail__events' },
            day.occurrences.map(renderDayOccurrence),
          )
        : h(
            'div',
            { class: 'cc-day-detail__empty-state' },
            'No events',
          ),
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
    previousMonth: () => true,
    nextMonth: () => true,
  },

  setup(props, { emit }) {
    const labels = computed(() => {
      const provided = [...props.weekdayLabels];
      return provided.length === props.model.columns
        ? provided
        : defaultWeekdayLabels(props.model.columns);
    });

    return () =>
      h(
        'section',
        {
          class: 'cc-calendar-month',
          'aria-label': `${props.model.year}-${props.model.month}`,
        },
        [
          h(
            'header',
            { class: 'cc-calendar-month__header' },
            [
              h(
                'button',
                {
                  type: 'button',
                  class: 'cc-calendar-month__nav',
                  disabled: props.busy,
                  'aria-label': 'Previous month',
                  onClick: () => emit('previousMonth'),
                },
                '‹',
              ),
              h(
                'h2',
                {
                  class: 'cc-calendar-month__title',
                },
                `${props.model.year} / ${props.model.month}`,
              ),
              h(
                'button',
                {
                  type: 'button',
                  class: 'cc-calendar-month__nav',
                  disabled: props.busy,
                  'aria-label': 'Next month',
                  onClick: () => emit('nextMonth'),
                },
                '›',
              ),
            ],
          ),
          h(
            'div',
            { class: 'cc-calendar-month__body' },
            [
              h(
                'div',
                { class: 'cc-calendar-month__calendar' },
                [
                  h(
                    'div',
                    {
                      class: 'cc-calendar-month__weekdays',
                      style: {
                        '--cc-calendar-columns': String(
                          props.model.columns,
                        ),
                      },
                    },
                    labels.value.map((label, index) =>
                      h(
                        'div',
                        {
                          class: 'cc-calendar-month__weekday',
                          'data-weekday': index,
                        },
                        label,
                      ),
                    ),
                  ),
                  h(
                    'div',
                    {
                      class: 'cc-calendar-month__grid',
                      style: {
                        '--cc-calendar-columns': String(
                          props.model.columns,
                        ),
                      },
                    },
                    props.model.cells.map(cell =>
                      h(
                        'button',
                        {
                          key: cell.key,
                          type: 'button',
                          class: [
                            'cc-month-cell',
                            {
                              'cc-month-cell--outside':
                                !cell.inCurrentMonth,
                              'cc-month-cell--today': cell.isToday,
                              'cc-month-cell--selected':
                                cell.isSelected,
                            },
                          ],
                          'data-calendar-date': cell.key,
                          'aria-pressed': cell.isSelected
                            ? 'true'
                            : 'false',
                          onClick: () =>
                            emit('selectDate', cell.date),
                        },
                        [
                          h(
                            'span',
                            {
                              class: 'cc-month-cell__day',
                            },
                            String(cell.date.day),
                          ),
                          renderOccurrences(
                            cell,
                            Math.max(
                              0,
                              Math.floor(
                                props.maxVisibleOccurrences,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              renderDayDetail(props.model.selectedDay),
            ],
          ),
        ],
      );
  },
});
