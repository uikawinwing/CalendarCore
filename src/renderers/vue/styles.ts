export const CALENDAR_MONTH_VIEW_CSS = String.raw`
.cc-calendar-month {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  font: inherit;
  color: inherit;
}

.cc-calendar-month *,
.cc-calendar-month *::before,
.cc-calendar-month *::after {
  box-sizing: border-box;
}

.cc-calendar-month__header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.cc-calendar-month__title {
  margin: 0;
  text-align: center;
  font-size: 1.05rem;
  font-weight: 650;
}

.cc-calendar-month__nav {
  min-width: 2.25rem;
  min-height: 2.25rem;
  border: 1px solid currentColor;
  border-radius: 0.65rem;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.75;
}

.cc-calendar-month__nav:disabled {
  cursor: default;
  opacity: 0.35;
}

.cc-calendar-month__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(12rem, 16rem);
  gap: 0.75rem;
  align-items: start;
}

.cc-calendar-month__calendar {
  min-width: 0;
}

.cc-calendar-month__weekdays,
.cc-calendar-month__grid {
  display: grid;
  grid-template-columns:
    repeat(var(--cc-calendar-columns), minmax(0, 1fr));
}

.cc-calendar-month__weekdays {
  margin-bottom: 0.35rem;
}

.cc-calendar-month__weekday {
  min-width: 0;
  padding: 0.35rem 0.2rem;
  text-align: center;
  font-size: 0.78rem;
  opacity: 0.6;
}

.cc-calendar-month__grid {
  overflow: hidden;
  border: 1px solid currentColor;
  border-radius: 0.8rem;
}

.cc-month-cell {
  position: relative;
  min-width: 0;
  min-height: 5rem;
  padding: 0.4rem;
  overflow: hidden;
  border: 0;
  border-right: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  border-bottom: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.cc-month-cell--outside {
  opacity: 0.42;
}

.cc-month-cell--today::before,
.cc-month-cell--selected::after {
  content: "";
  position: absolute;
  inset: 0.2rem;
  pointer-events: none;
  border-radius: 0.55rem;
}

.cc-month-cell--today::before {
  border: 1px dashed currentColor;
  opacity: 0.45;
}

.cc-month-cell--selected::after {
  border: 2px solid currentColor;
}

.cc-month-cell__day {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.8rem;
  font-weight: 650;
}

.cc-month-cell__events {
  display: grid;
  gap: 0.2rem;
}

.cc-month-event {
  min-width: 0;
  padding: 0.18rem 0.3rem;
  overflow: hidden;
  border-radius: 0.35rem;
  background: color-mix(in srgb, currentColor 10%, transparent);
  font-size: 0.7rem;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cc-month-event--overflow {
  background: transparent;
  opacity: 0.6;
}

.cc-day-detail {
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
  border-radius: 0.8rem;
}

.cc-day-detail--empty,
.cc-day-detail__empty-state {
  opacity: 0.55;
}

.cc-day-detail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
}

.cc-day-detail__title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 650;
}

.cc-day-detail__today {
  padding: 0.12rem 0.35rem;
  border: 1px solid currentColor;
  border-radius: 999px;
  font-size: 0.65rem;
  opacity: 0.65;
}

.cc-day-detail__events {
  display: grid;
  gap: 0.45rem;
}

.cc-day-detail__event {
  min-width: 0;
  padding: 0.55rem;
  border-radius: 0.55rem;
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.cc-day-detail__event-topline {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.66rem;
  opacity: 0.62;
}

.cc-day-detail__module {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cc-day-detail__event-title {
  overflow-wrap: anywhere;
  font-size: 0.82rem;
  font-weight: 600;
}

@media (max-width: 760px) {
  .cc-calendar-month__body {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .cc-calendar-month__header {
    margin-bottom: 0.5rem;
  }

  .cc-month-cell {
    min-height: 3.7rem;
    padding: 0.3rem;
  }

  .cc-month-cell__day {
    margin-bottom: 0.2rem;
  }

  .cc-month-event {
    padding: 0.12rem 0.2rem;
    font-size: 0.64rem;
  }

  .cc-day-detail {
    padding: 0.6rem;
  }
}
`;
