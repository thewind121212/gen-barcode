import { env } from "@Ciri/env";
import pino from "pino";

export enum LogType {
  INFRASTRUCTURE = "Infrastructure:",
  REPO = "Repository:",
  SERVICE = "Service:",
  ROUTER = "Router:",
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
    pinoLogger[logLevel](`${type} ${message}`);
  }
}

export function UnitLogger(unitType: LogType, unitName: string, logLevel: LogLevel, message: string) {
  if (logLevel === LogLevel.DEBUG && env.ENVIRONMENT !== "dev")
    return;
  if (!pinoLogger) {
    InitPinoLogger();
  }
  if (pinoLogger && pinoLogger[logLevel]) {
    pinoLogger[logLevel](`${unitType}-${unitName} ${message}`);
  }
}
