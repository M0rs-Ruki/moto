export const VISITOR_PAGE_SIZE = 10;
export const SESSION_PAGE_SIZE = 10;

export const CACHE_KEYS = {
  CATEGORIES: "cache_daily_walkins_categories",
  VISITORS: "cache_daily_walkins_visitors",
  SESSIONS: "cache_daily_walkins_sessions",
} as const;

export const CACHE_DURATIONS = {
  CATEGORIES: 300000, // 5 minutes
  VISITORS: 120000, // 2 minutes
  SESSIONS: 120000, // 2 minutes
  FRESH_THRESHOLD: 30000, // 30 seconds
} as const;

export const FEEDBACK_OPTIONS = ["happy", "okay", "sad"] as const;
export type FeedbackOption = (typeof FEEDBACK_OPTIONS)[number];
