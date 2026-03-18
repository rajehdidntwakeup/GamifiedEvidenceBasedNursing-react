const DEFAULT_INVALID_PASSWORD_MESSAGE = "That password is not correct. Please try again.";
const DEFAULT_NETWORK_ERROR_MESSAGE =
  "Unable to reach the server. Check your connection and try again.";
const DEFAULT_SERVER_ERROR_MESSAGE =
  "The server had a problem unlocking this mission. Please try again in a moment.";
const DEFAULT_GENERIC_ERROR_MESSAGE = "Unable to unlock the mission right now. Please try again.";

const PASS_THROUGH_MESSAGES = new Set([
  "select a mission first.",
  "password is required.",
  "no active game found. ask an admin to create a game first.",
]);

const INVALID_PASSWORD_PATTERNS = [
  "incorrect password",
  "invalid password",
  "wrong password",
  "password is invalid",
  "bad credentials",
  "unauthorized",
  "401",
  "forbidden",
  "403",
];

const NETWORK_PATTERNS = [
  "failed to fetch",
  "networkerror",
  "network error",
  "timeout",
  "connection",
];

export function getFriendlyPasswordError(errorMessage?: string | null): string {
  const normalizedError = errorMessage?.trim().toLowerCase();

  if (!normalizedError) {
    return DEFAULT_INVALID_PASSWORD_MESSAGE;
  }

  if (PASS_THROUGH_MESSAGES.has(normalizedError)) {
    return errorMessage as string;
  }

  if (INVALID_PASSWORD_PATTERNS.some((pattern) => normalizedError.includes(pattern))) {
    return DEFAULT_INVALID_PASSWORD_MESSAGE;
  }

  if (NETWORK_PATTERNS.some((pattern) => normalizedError.includes(pattern))) {
    return DEFAULT_NETWORK_ERROR_MESSAGE;
  }

  if (
    normalizedError.includes("internal server error") ||
    normalizedError.includes("service unavailable") ||
    normalizedError.includes("gateway") ||
    /^http\s*5\d{2}$/.test(normalizedError)
  ) {
    return DEFAULT_SERVER_ERROR_MESSAGE;
  }

  if (/^http\s*\d{3}$/.test(normalizedError)) {
    return DEFAULT_GENERIC_ERROR_MESSAGE;
  }

  return DEFAULT_GENERIC_ERROR_MESSAGE;
}
