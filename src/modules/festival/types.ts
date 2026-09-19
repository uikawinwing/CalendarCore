export interface FestivalMonthDay {
  month: number;
  day: number;
}

export interface FestivalStageDefinition {
  id: string;
  title: string;
  start: FestivalMonthDay;
  end?: FestivalMonthDay;
  anchorYear?: number;
  repeatEveryYears?: number | null;
  summary?: string;
  metadata?: Readonly<Record<string, unknown>>;
}

export interface FestivalDefinition {
  id: string;
  title: string;
  start: FestivalMonthDay;
  end?: FestivalMonthDay;
  anchorYear: number;
  repeatEveryYears: number | null;
  summary?: string;
  tags?: string[];
  relatedBookIds?: string[];
  locationKeywords?: string[];
  metadata?: Readonly<Record<string, unknown>>;
  stages?: FestivalStageDefinition[];
}
