import pino from "pino";

const INFRASTRUCTURE_LOG_PREFIX = "Infrastructure:"
const REPO_LOG_PREFIX = "Repository:"

export const enum LogType {
    INFRASTRUCTURE = INFRASTRUCTURE_LOG_PREFIX,
    REPO = REPO_LOG_PREFIX
}

export const logger = (type: LogType, logLevel: "info" | "error" | "warn" | "debug", message: string) => {
    const log = pino()
    if (log[logLevel]) {
        log[logLevel](`${type} ${message}`)
    }
}





