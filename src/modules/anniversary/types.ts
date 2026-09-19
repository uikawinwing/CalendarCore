import type { CalendarDate } from '../../core';

export interface AnniversaryDefinition {
  id: string;
  title: string;
  date: CalendarDate;
  category?: string;
  notes?: string;
  tags?: string[];
  metadata?: Readonly<Record<string, unknown>>;
}
