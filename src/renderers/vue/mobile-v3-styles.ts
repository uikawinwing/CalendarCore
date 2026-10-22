export const MOBILE_V3_CSS = String.raw`
/* V3 layout: persistent agenda instead of a full-screen day overlay. */
.cc-calendar-month { position: relative; }
.cc-calendar-month__month-switcher,
.cc-calendar-month__header-actions { display: flex; align-items: center; gap: 5px; min-width: 0; }
.cc-calendar-month__month-switcher { flex: 1; }
.cc-calendar-month__header-actions { margin-left: auto; }
.cc-calendar-month__today-link {
  min-height: 34px; padding: 0 9px; border: 1px solid #b78d80;
  border-radius: 9px; background: #f8eade; color: #8c3525;
  font: inherit; font-size: 12px; font-weight: 800; cursor: pointer; white-space: nowrap;
}
.cc-calendar-month__today-link:disabled { opacity: .4; cursor: default; }
.cc-calendar-month__fold, .cc-calendar-month__bottom-nav { display: none; }
.cc-day-detail__event {
  display: flex; align-items: center; gap: 12px; width: 100%;
  font: inherit; text-align: left; cursor: pointer;
}
.cc-day-detail__event-content { flex: 1; min-width: 0; display: grid; gap: 5px; }
.cc-day-detail__event-title { display: block; font-size: 14px; }
.cc-day-detail__event-topline {
  display: flex; justify-content: flex-start; flex-wrap: wrap;
  gap: 9px; margin: 0; font-size: 11px;
}
.cc-day-detail__event-mark {
  display: block; flex: 0 0 7px; align-self: stretch; min-height: 22px;
  border-radius: 99px; background: var(--cc-category, #806850);
}
.cc-day-detail__event-arrow { color: #826342; font-size: 23px; }
.cc-day-detail__count { font-size: 11px; color: #826342; font-weight: 800; }
.cc-day-detail__event[data-module-id="festival"], .cc-month-event[data-module-id="festival"] { --cc-category: #a73326; }
.cc-day-detail__event[data-module-id="class"], .cc-month-event[data-module-id="class"] { --cc-category: #246b51; }
.cc-day-detail__event[data-module-id="appointment"], .cc-month-event[data-module-id="appointment"] { --cc-category: #80375e; }
.cc-day-detail__event[data-module-id="anniversary"], .cc-month-event[data-module-id="anniversary"],
.cc-day-detail__event[data-module-id="birthday"], .cc-month-event[data-module-id="birthday"] { --cc-category: #a16a12; }
.cc-day-detail__event[data-module-id="reminder"], .cc-month-event[data-module-id="reminder"] { --cc-category: #315f86; }
.cc-day-detail__event[data-module-id="history"], .cc-month-event[data-module-id="history"] { --cc-category: #69616e; }
.cc-day-detail__event[data-module-id="event"], .cc-month-event[data-module-id="event"] { --cc-category: #5b6942; }
.cc-calendar-month button:focus-visible { outline: 3px solid #b47b22; outline-offset: -3px; }
.cc-event-sheet {
  position: absolute; inset: 0; z-index: 10;
  display: flex; align-items: flex-end; justify-content: center;
  background: rgba(26, 18, 11, .52);
}
.cc-event-sheet__card {
  width: min(520px, 100%); max-height: 80%;
  overflow: hidden; border-radius: 18px 18px 0 0;
  background: #fcf9f2; color: #30251a;
  box-shadow: 0 -10px 34px rgba(20, 13, 6, .28);
}
.cc-event-sheet__header {
  display: flex; align-items: center; justify-content: space-between;
  min-height: 50px; padding: 8px 14px; border-bottom: 1px solid #d6c6b1;
  font-size: 12px; font-weight: 800; color: #70543c;
}
.cc-event-sheet__close {
  min-height: 36px; padding: 5px 10px; border: 1px solid #b9a386;
  border-radius: 9px; background: #f8f0e5; color: #654526;
  font: inherit; font-weight: 800; cursor: pointer;
}
.cc-event-sheet__content { max-height: 65dvh; overflow-y: auto; padding: 18px; }
.cc-event-sheet__title { margin: 0 0 17px; font-size: 19px; overflow-wrap: anywhere; }
.cc-event-sheet__fields {
  display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 13px 12px;
  margin: 0; font-size: 13px; line-height: 1.5;
}
.cc-event-sheet__fields dt { color: #80664d; font-weight: 700; }
.cc-event-sheet__fields dd { margin: 0; overflow-wrap: anywhere; }

@media (max-width: 980px) {
  .cc-calendar-month {
    display: flex; flex-direction: column; width: 100%; height: 100%;
    background: #f6f0e4;
  }
  .cc-calendar-month__header {
    flex: 0 0 auto; min-height: 54px;
    padding: 7px 58px 7px 5px; gap: 3px;
    border-bottom: 1px solid #d6c6b1; background: #fcf9f2;
  }
  .cc-calendar-month__month-switcher { flex: 1 1 auto; gap: 0; }
  .cc-calendar-month__title {
    margin: 0 2px; color: #231911; font-size: clamp(13px, 3.6vw, 17px);
    white-space: nowrap; font-weight: 850;
  }
  .cc-calendar-month__nav {
    flex: 0 0 32px; width: 32px; height: 38px;
    border-radius: 9px; box-shadow: none; background: transparent;
    font-size: 24px;
  }
  .cc-calendar-month__header-actions { margin-left: 0; flex: 0 0 auto; }
  .cc-calendar-month__today-link { min-height: 32px; padding: 0 5px; font-size: 11px; }
  .cc-calendar-month__body {
    display: flex; flex-direction: column; flex: 1 1 auto;
    min-height: 0; min-width: 0; overflow: hidden; padding: 0; gap: 0;
  }
  .cc-calendar-month__calendar {
    display: flex; flex-direction: column; flex: 0 0 auto;
    width: 100%; height: auto; min-height: 0; overflow: hidden;
    border: 0; border-radius: 0; box-shadow: none; background: #fcf9f2;
  }
  .cc-calendar-month__weekdays {
    flex: 0 0 29px; min-height: 29px; border-bottom: 1px solid #d6c6b1;
    background: #ebe1ce;
  }
  .cc-calendar-month__weekday { min-height: 29px; padding: 4px 0; font-size: 11px; color: #604c36; }
  .cc-calendar-month__grid {
    display: grid; flex: 0 0 auto; grid-auto-rows: minmax(62px, auto);
    align-content: start; min-height: 0; max-height: min(42dvh, 350px);
    overflow-y: auto; overscroll-behavior: contain;
  }
  .cc-calendar-month[data-expanded="false"] .cc-calendar-month__grid {
    max-height: 62px; overflow: hidden;
  }
  .cc-calendar-month[data-expanded="false"] .cc-month-cell:not(.cc-month-cell--active-week) { display: none; }
  .cc-month-cell {
    display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
    gap: 4px; min-height: 62px; padding: 6px 1px 5px;
    border-right: 1px solid #e6d8c3; border-bottom: 1px solid #e6d8c3;
    background: #fcf9f2; text-align: center;
  }
  .cc-month-cell--outside { background: #f0e9dc; }
  .cc-month-cell--today { box-shadow: none; }
  .cc-month-cell--selected { background: #f6e7cb; }
  .cc-month-cell--selected::after { display: none; }
  .cc-month-cell__day {
    display: grid; place-items: center;
    min-width: 29px; height: 29px; margin: 0; padding: 0 3px;
    border: 2px solid transparent; border-radius: 50%;
    font-size: 13px; font-weight: 850; color: #31241a;
  }
  .cc-month-cell--outside .cc-month-cell__day { color: #806b55; }
  .cc-month-cell--today .cc-month-cell__day { border-color: #ad402e; }
  .cc-month-cell--selected .cc-month-cell__day { color: #fffaf2; background: #38281c; }
  .cc-month-cell--today.cc-month-cell--selected .cc-month-cell__day { border-color: #ad402e; }
  .cc-month-cell__events {
    display: flex; flex-direction: row; justify-content: center; align-items: center;
    gap: 2px; width: 100%; min-height: 7px;
  }
  .cc-month-event {
    display: block; flex: 0 0 6px; width: 6px; height: 6px;
    min-width: 0; overflow: hidden; padding: 0; border: 0;
    border-radius: 50%; background: var(--cc-category, #806850);
    color: transparent; font-size: 0; line-height: 0; white-space: nowrap;
  }
  .cc-month-event--overflow {
    flex-basis: auto; width: auto; height: auto;
    background: transparent; color: #5e4934; font-size: 9px; line-height: 1;
  }
  .cc-calendar-month__fold {
    display: block; flex: 0 0 28px; width: 100%; height: 28px;
    border: 0; border-bottom: 1px solid #d6c6b1;
    background: #ebe1ce; color: #654825;
    font: inherit; font-size: 11px; font-weight: 800; cursor: pointer;
  }
  .cc-day-detail {
    position: static; display: flex; flex-direction: column;
    flex: 1 1 auto; min-height: 0; overflow: hidden;
    border: 0; border-radius: 0; background: #f6f0e4; box-shadow: none;
  }
  .cc-day-detail__header {
    flex: 0 0 auto; min-height: 62px; padding: 10px 14px;
    background: #f6f0e4; border: 0;
  }
  .cc-day-detail__heading { gap: 4px; }
  .cc-day-detail__eyebrow { color: #68513c; font-size: 10px; }
  .cc-day-detail__title { color: #231911; font-size: 18px; }
  .cc-day-detail__today, .cc-day-detail__count { color: #8d2d1f; font-size: 11px; font-weight: 800; }
  .cc-day-detail__events {
    display: grid; align-content: start; flex: 1 1 auto;
    min-height: 0; gap: 8px; padding: 3px 12px 14px;
    overflow-y: auto; overscroll-behavior: contain;
  }
  .cc-day-detail__event {
    min-height: 62px; padding: 10px 11px;
    border: 1px solid #d3bea5; border-radius: 12px;
    background: #fcf9f2; box-shadow: none;
  }
  .cc-day-detail__event-title { color: #231911; font-size: 14px; }
  .cc-day-detail__event-topline { font-size: 11px; color: #604b35; }
  .cc-day-detail__module { color: #654a38; }
  .cc-day-detail__empty-state { font-size: 13px; color: #604b35; }
  .cc-calendar-month__bottom-nav {
    display: grid; flex: 0 0 auto; grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px; min-height: 54px;
    padding: 7px 10px calc(7px + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid #d6c6b1; background: #fcf9f2;
    z-index: 20;
  }
  .cc-calendar-month__bottom-nav button {
    min-height: 40px; padding: 6px 3px; border: 1px solid #ccb69c;
    border-radius: 10px; background: #eee2ce; color: #422f1f;
    font: inherit; font-size: 12px; font-weight: 850; cursor: pointer; white-space: nowrap;
  }
  .cc-calendar-month__bottom-nav button:disabled { opacity: .48; }
  .cc-event-sheet { bottom: 54px; z-index: 12; }
  .cc-event-sheet__card { max-height: min(75dvh, 620px); }
}
@media (max-width: 360px) {
  .cc-calendar-month__header { padding-left: 3px; padding-right: 49px; }
  .cc-calendar-month__title { font-size: 13px; }
  .cc-calendar-month__nav { flex-basis: 27px; width: 27px; }
  .cc-calendar-month__today-link { font-size: 10px; padding: 0 4px; }
  .cc-month-cell__day { min-width: 27px; height: 27px; font-size: 12px; }
}
@media (prefers-color-scheme: dark) and (max-width: 980px) {
  .cc-calendar-month { background: #1f1b19; color: #eee5d7; --cc-ink: #eee5d7; }
  .cc-calendar-month__header, .cc-calendar-month__calendar, .cc-calendar-month__bottom-nav { background: #29231e; }
  .cc-calendar-month__title, .cc-day-detail__title, .cc-day-detail__event-title { color: #f4ece0; }
  .cc-calendar-month__nav { background: transparent; color: #f6d396; }
  .cc-calendar-month__weekdays, .cc-calendar-month__fold { background: #352c23; }
  .cc-calendar-month__weekday, .cc-calendar-month__fold { color: #e5d2b5; }
  .cc-month-cell { background: #29231e; }
  .cc-month-cell--outside { background: #241f1b; }
  .cc-month-cell--selected { background: #463726; }
  .cc-month-cell__day { color: #f5e9da; }
  .cc-month-cell--outside .cc-month-cell__day { color: #a99984; }
  .cc-month-cell--selected .cc-month-cell__day { background: #e5ca9f; color: #21180e; }
  .cc-day-detail, .cc-day-detail__header { background: #1f1b19; }
  .cc-day-detail__eyebrow, .cc-day-detail__event-topline, .cc-day-detail__module { color: #cfb89a; }
  .cc-day-detail__event { background: #2c261f; border-color: #554538; }
  .cc-day-detail__empty-state { color: #cbb59b; }
  .cc-calendar-month__bottom-nav button { background: #423528; color: #f4e5d0; }
  .cc-calendar-month__today-link { color: #f4b9a9; border-color: #a66554; background: #352723; }
  .cc-event-sheet__card { background: #29231e; color: #f4ece0; }
  .cc-event-sheet__header, .cc-event-sheet__fields dt { color: #cfb89a; }
  .cc-event-sheet__close { background: #423528; color: #f4e5d0; }
}
`;
