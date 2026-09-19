import type { CalendarPoint } from '../../core';
import type { ModuleEventReference } from '../shared/event-reference';

export type HistorySource = ModuleEventReference;

export interface HistoryDefinition {
  id: string;
  title: string;
  occurredAt: CalendarPoint;
  source?: HistorySource;
  outcome?: string;
  notes?: string;
  tags?: string[];
  metadata?: Readonly<Record<string, unknown>>;
}
