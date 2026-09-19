import type { CalendarDate } from '../../core';

export interface BirthdayDefinition {
  id: string;
  title: string;
  date: CalendarDate;
  subject?: string;
  notes?: string;
  tags?: string[];
  metadata?: Readonly<Record<string, unknown>>;
}
