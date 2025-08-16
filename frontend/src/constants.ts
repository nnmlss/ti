import type { WindDirection } from '@types';

// Access Options
export const accessOptions = [
  { _id: 0, bg: 'hike and fly', en: 'hike and fly' },
  { _id: 1, bg: 'автомобил', en: 'automobile' },
  { _id: 2, bg: 'автобус', en: 'bus' },
  { _id: 3, bg: '4х4', en: '4x4' },
  { _id: 4, bg: 'лифт', en: 'chairlift' },
];

// Wind Directions
export const windDirections: WindDirection[] = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
];

// Routes
export const validRoutes = ['/', '/add-site', '/edit-site', '/site'];

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  PASSWORD_VALIDATION_DELAY: 3000,
  PASSWORD_MATCH_DELAY: 5000,
  PASSWORD_LENGTH_DELAY: 3000,
  FORM_VALIDATION_DELAY: 3000,
} as const;

// Auth Constants
export const AUTH_CONSTANTS = {
  DEFAULT_EXPIRY_MINUTES: 7,
} as const;

// Form Defaults
export const FORM_DEFAULTS = {
  EMPTY_STRING_ARRAY: [''] as const,
  EMPTY_COORDINATES: ['', ''] as const,
  EMPTY_BILINGUAL_ARRAY: { bg: [''], en: [''] } as const,
  POINT_TYPE: 'Point' as const,
} as const;