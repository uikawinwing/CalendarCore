import { fatePoemProfile } from './fate-poem';
export type { CalendarProfile, CalendarProfileMatch } from './types';
export {
  fatePoemProfile,
  FATE_POEM_PATHS,
  parseFatePoemWorldTime,
  parseFatePoemWorldPoint,
} from './fate-poem';

/** Bundled optional profiles. Add a creator profile here, not to Core/Host. */
export const bundledCalendarProfiles = [fatePoemProfile] as const;
