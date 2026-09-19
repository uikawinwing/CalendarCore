export const CALENDAR_MONTH_VIEW_CSS = String.raw`
[data-calendar-core-mount="vue-month"] {
  height: 100%;
  min-height: 0;
}

.cc-calendar-month {
  --cc-ink: #2c241b;
  --cc-muted: #806f5e;
  --cc-line: rgba(155, 128, 84, 0.16);
  --cc-line-strong: rgba(155, 128, 84, 0.26);
  --cc-surface: rgba(255, 252, 246, 0.96);
  --cc-surface-2: rgba(247, 240, 229, 0.92);
  --cc-accent: #8b5a19;
  --cc-accent-soft: #f1dfb9;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  color: var(--cc-ink);
  font: inherit;
  background:
    radial-gradient(circle at 8% 0%, rgba(239, 209, 137, 0.12), transparent 32%),
    linear-gradient(180deg, #fffdf8, #f8f0e5);
}

.cc-calendar-month *,
.cc-calendar-month *::before,
.cc-calendar-month *::after {
  box-sizing: border-box;
}

.cc-calendar-month__header {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--cc-line);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,249,240,0.82));
}

.cc-calendar-month__header-copy {
  min-width: 0;
  display: grid;
  gap: 2px;
}

.cc-calendar-month__kicker {
  color: #9a8268;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.16em;
}

.cc-calendar-month__title {
  margin: 0;
  color: #3b2d1f;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: 0.01em;
}

.cc-calendar-month__nav-group {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cc-calendar-month__nav {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--cc-line-strong);
  border-radius: 11px;
  background: rgba(255, 252, 246, 0.92);
  color: #6e4510;
  font: inherit;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: 140ms ease;
}

.cc-calendar-month__nav:hover {
  transform: translateY(-1px);
  border-color: rgba(188, 135, 45, 0.42);
  background: linear-gradient(180deg, #fff7ea, #f4dfad);
  box-shadow: 0 8px 18px rgba(82, 48, 8, 0.12);
}

.cc-calendar-month__nav:disabled {
  cursor: default;
  opacity: 0.38;
  transform: none;
  box-shadow: none;
}

.cc-calendar-month__body {
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.88fr);
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

.cc-calendar-month__calendar,
.cc-day-detail {
  min-width: 0;
  min-height: 0;
  border: 1px solid var(--cc-line);
  border-radius: 18px;
  background: var(--cc-surface);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.72),
    0 12px 28px rgba(75, 51, 25, 0.06);
}

.cc-calendar-month__calendar {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
}

.cc-calendar-month__weekdays,
.cc-calendar-month__grid {
  display: grid;
  grid-template-columns:
    repeat(var(--cc-calendar-columns), minmax(0, 1fr));
}

.cc-calendar-month__weekdays {
  min-height: 40px;
  border-bottom: 1px solid var(--cc-line);
  background: rgba(247, 239, 225, 0.86);
}

.cc-calendar-month__weekday {
  min-width: 0;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  color: #7a6a58;
  font-size: 12px;
  font-weight: 750;
}

.cc-calendar-month__grid {
  min-height: 0;
  overflow: auto;
  align-content: stretch;
}

.cc-month-cell {
  position: relative;
  min-width: 0;
  min-height: 88px;
  padding: 9px 9px 7px;
  overflow: hidden;
  border: 0;
  border-right: 1px solid rgba(155, 128, 84, 0.12);
  border-bottom: 1px solid rgba(155, 128, 84, 0.12);
  background: rgba(255, 253, 248, 0.9);
  color: var(--cc-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 120ms ease;
}

.cc-month-cell:hover {
  background: #fff8ec;
}

.cc-month-cell--outside {
  background: #f6f1e7;
  color: #b3a392;
}

.cc-month-cell--today {
  box-shadow: inset 0 0 0 2px rgba(188, 135, 45, 0.44);
}

.cc-month-cell--selected {
  background:
    linear-gradient(180deg, #fff8e8, #f9e9c8);
}

.cc-month-cell--selected::after {
  content: "";
  position: absolute;
  inset: 4px;
  pointer-events: none;
  border: 1px solid rgba(188, 135, 45, 0.46);
  border-radius: 10px;
}

.cc-month-cell__day {
  display: block;
  margin-bottom: 6px;
  color: currentColor;
  font-size: 12px;
  font-weight: 850;
}

.cc-month-cell__events {
  display: grid;
  gap: 3px;
}

.cc-month-event {
  min-width: 0;
  padding: 4px 6px;
  overflow: hidden;
  border: 1px solid rgba(183, 143, 75, 0.14);
  border-radius: 8px;
  background: rgba(239, 220, 184, 0.64);
  color: #5e4528;
  font-size: 10.5px;
  font-weight: 720;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cc-month-event--overflow {
  border-color: transparent;
  background: transparent;
  color: #8c755c;
}

.cc-day-detail {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
}

.cc-day-detail--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  color: #998774;
  font-size: 12px;
}

.cc-day-detail__header {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--cc-line);
  background: linear-gradient(180deg, #fffdf8, #f7efe2);
}

.cc-day-detail__heading {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: 2px;
}

.cc-day-detail__eyebrow {
  color: #9b8269;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.cc-day-detail__title {
  margin: 0;
  color: #3b2d1f;
  font-size: 16px;
  font-weight: 800;
}

.cc-day-detail__today {
  padding: 4px 8px;
  border: 1px solid rgba(188, 135, 45, 0.28);
  border-radius: 999px;
  background: rgba(243, 223, 181, 0.5);
  color: #74480f;
  font-size: 10px;
  font-weight: 850;
}

.cc-day-detail__back {
  display: none;
}

.cc-day-detail__events {
  min-height: 0;
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 14px;
  overflow: auto;
}

.cc-day-detail__event {
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--cc-line);
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(255, 253, 248, 0.94), rgba(248, 240, 226, 0.72));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.66);
}

.cc-day-detail__event-topline {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 5px;
  color: #8a745d;
  font-size: 10px;
  font-weight: 750;
}

.cc-day-detail__module {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cc-day-detail__event-title {
  overflow-wrap: anywhere;
  color: #4a3827;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
}

.cc-day-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 9px;
}

.cc-day-detail__tag {
  padding: 3px 7px;
  border-radius: 999px;
  background: rgba(223, 236, 255, 0.72);
  color: #41668e;
  font-size: 9.5px;
  font-weight: 750;
}

.cc-day-detail__empty-state {
  margin: 14px;
  padding: 18px;
  border: 1px dashed var(--cc-line-strong);
  border-radius: 14px;
  color: #998774;
  font-size: 12px;
  text-align: center;
}

@media (max-width: 980px) {
  .cc-calendar-month__header {
    min-height: 58px;
    padding: 10px 12px;
  }

  .cc-calendar-month__kicker {
    display: none;
  }

  .cc-calendar-month__title {
    font-size: 17px;
  }

  .cc-calendar-month__nav {
    width: 34px;
    height: 34px;
  }

  .cc-calendar-month__body {
    position: relative;
    display: block;
    padding: 0;
  }

  .cc-calendar-month__calendar {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .cc-calendar-month__weekdays {
    min-height: 34px;
  }

  .cc-calendar-month__weekday {
    min-height: 34px;
    padding: 8px 2px;
    font-size: 11px;
  }

  .cc-month-cell {
    min-height: 74px;
    padding: 7px 5px;
  }

  .cc-month-cell__day {
    margin-bottom: 4px;
  }

  .cc-month-event {
    padding: 3px 4px;
    border-radius: 6px;
    font-size: 9px;
  }

  .cc-day-detail {
    position: absolute;
    inset: 0;
    z-index: 5;
    border: 0;
    border-radius: 0;
    background: #fffaf1;
    box-shadow: none;
  }

  .cc-day-detail--empty {
    display: none;
  }

  .cc-day-detail__header {
    min-height: 58px;
    padding: 10px 12px;
  }

  .cc-day-detail__back {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 6px 10px;
    border: 1px solid var(--cc-line-strong);
    border-radius: 10px;
    background: rgba(255,252,246,0.92);
    color: #6e4510;
    font: inherit;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  }

  .cc-day-detail__title {
    font-size: 14px;
  }

  .cc-day-detail__events {
    padding: 12px;
  }
}

@media (max-width: 520px) {
  .cc-month-cell {
    min-height: 68px;
  }

  .cc-month-event {
    font-size: 8.5px;
  }
}
`;
