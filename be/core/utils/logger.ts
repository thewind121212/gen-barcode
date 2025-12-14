import pino from "pino";

import { env } from "@Ciri/core/env";
import { CaptureSentryMessage } from "@Ciri/sentry/init";

export enum LogType {
  INFRASTRUCTURE = "Infrastructure",
  REPO = "Repository",
  SERVICE = "Service",
  ROUTER = "Router",
}

export enum LogLevel {
  INFO = "info",
  ERROR = "error",
  WARN = "warn",
  DEBUG = "debug",
  FATAL = "fatal",
}

const pinoConfig = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "hostname",
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
    },
  },
};

let pinoLogger: pino.Logger | null = null;

export function InitPinoLogger() {
  pinoLogger = pino({
    ...pinoConfig,
  });
}

export function GeneralLogger(type: LogType, logLevel: LogLevel, message: string) {
  if (logLevel === LogLevel.DEBUG && env.ENVIRONMENT !== "dev")
    return;
  if (!pinoLogger) {
    InitPinoLogger();
  }
  if (pinoLogger && pinoLogger[logLevel]) {
    const errorMessage = `${type} ${message}`;
    pinoLogger[logLevel](errorMessage);
    if (logLevel === LogLevel.ERROR) {
      CaptureSentryMessage(errorMessage, "error");
    }
  }
}

export function UnitLogger(unitType: LogType, unitName: string, logLevel: LogLevel, message: string) {
  if (logLevel === LogLevel.DEBUG && env.ENVIRONMENT !== "dev")
    return;
  if (!pinoLogger) {
    InitPinoLogger();
  }
  if (pinoLogger && pinoLogger[logLevel]) {
    const errorMessage = `${unitType}<-${unitName}: ${message}`;
    pinoLogger[logLevel](errorMessage);
    if (logLevel === LogLevel.ERROR) {
      CaptureSentryMessage(errorMessage, "error");
    }
  }
}
