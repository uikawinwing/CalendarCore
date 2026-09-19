export interface CalendarSystem {
  readonly id: string;
  monthsInYear(year: number): number;
  daysInMonth(year: number, month: number): number;
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${label} must be a positive integer`);
  }
}

export function isGregorianLeapYear(year: number): boolean {
  assertPositiveInteger(year, 'year');
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

export const gregorianCalendarSystem: CalendarSystem = {
  id: 'gregorian',

  monthsInYear(year) {
    assertPositiveInteger(year, 'year');
    return 12;
  },

  daysInMonth(year, month) {
    assertPositiveInteger(year, 'year');
    assertPositiveInteger(month, 'month');

    if (month > 12) {
      throw new RangeError('month must be between 1 and 12 for the Gregorian calendar');
    }

    if (month === 2) {
      return isGregorianLeapYear(year) ? 29 : 28;
    }

    return [4, 6, 9, 11].includes(month) ? 30 : 31;
  },
};
