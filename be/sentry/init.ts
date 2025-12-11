import * as Sentry from "@sentry/node";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";

const dsn = process.env.SENTRY_DSN;
let isInitialized = false;
let isEnabled = false;

function ensureSentryInitialized() {
  if (isInitialized) return;
  isInitialized = true;

  if (!dsn) {
    UnitLogger(
      LogType.INFRASTRUCTURE,
      "Sentry",
      LogLevel.WARN,
      "SENTRY_DSN is not set – Sentry disabled"
    );
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
  });

  isEnabled = true;
  UnitLogger(
    LogType.INFRASTRUCTURE,
    "Sentry",
    LogLevel.INFO,
    "Sentry initialized at dsn: " + dsn
  );
}

export function InitSentry() {
  ensureSentryInitialized();
}

export function CaptureSentryException(
  error: unknown,
  extra?: Record<string, unknown>
) {
  ensureSentryInitialized();
  if (!isEnabled) return;

  Sentry.captureException(error, (scope) => {
    if (extra) {
      Object.entries(extra).forEach(([key, value]) =>
        scope.setExtra(key, value)
      );
    }
    return scope;
  });
}

export function CaptureSentryMessage(
  message: string,
  level: Sentry.SeverityLevel = "info"
) {
  ensureSentryInitialized();
  if (!isEnabled) return;
  Sentry.captureMessage(message, level);
}

