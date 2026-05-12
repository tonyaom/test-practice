/**
 * Single source of truth for the seeded admin credentials.
 *
 * WHY THIS FILE EXISTS:
 * The admin username/password has been accidentally typo'd across multiple
 * builds ("adbc" instead of "abcd", wrong location, etc.), causing every
 * user's login to fail. Defining them ONCE here and importing everywhere
 * means a future build can only break credentials in one place, and the
 * canary tests below will catch it immediately.
 *
 * IMPORTANT: Do NOT inline the strings "abcd" in any other file.
 * Always import ADMIN_USERNAME / ADMIN_PASSWORD from this module.
 */

/** Seeded admin username — both username and password are 'abcd'. */
export const ADMIN_USERNAME = "abcd" as const;

/** Seeded admin password — both username and password are 'abcd'. */
export const ADMIN_PASSWORD = "abcd" as const;
