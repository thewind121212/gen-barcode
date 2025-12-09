import pino from "pino";
import { env } from "../env";

const INFRASTRUCTURE_LOG_PREFIX = "Infrastructure:"
const REPO_LOG_PREFIX = "Repository:"
const SERVICE_LOG_PREFIX = "Service:"
const ROUTER_LOG_PREFIX = "Router:"

export const enum LogType {
    INFRASTRUCTURE = INFRASTRUCTURE_LOG_PREFIX,
    REPO = REPO_LOG_PREFIX,
    SERVICE = SERVICE_LOG_PREFIX,
    ROUTER = ROUTER_LOG_PREFIX
}

export const enum LogLevel {
    INFO = "info",
    ERROR = "error",
    WARN = "warn",
    DEBUG = "debug",
    FATAL = "fatal"
}

const pinoConfig = {
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            ignore: "hostname",
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
        }
    }
}

let pinoLogger: pino.Logger | null = null

export const InitPinoLogger = () => {
    pinoLogger = pino({
        ...pinoConfig,
    })
}

export const GeneralLogger = (type: LogType, logLevel: LogLevel, message: string) => {
    if (logLevel === LogLevel.DEBUG && env.ENVIRONMENT !== "dev") return
    if (!pinoLogger) {
        InitPinoLogger()
    }
    if (pinoLogger && pinoLogger[logLevel]) {
        pinoLogger[logLevel](`${type} ${message}`)
    }
}

export const UnitLogger = (unitType: LogType, unitName: string, logLevel: LogLevel, message: string) => {
    if (logLevel === LogLevel.DEBUG && env.ENVIRONMENT !== "dev") return
    if (!pinoLogger) {
        InitPinoLogger()
    }
    if (pinoLogger && pinoLogger[logLevel]) {
        pinoLogger[logLevel](`${unitType}-${unitName} ${message}`)
    }
}





