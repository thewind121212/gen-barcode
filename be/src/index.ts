import app from "./app.js";
import { env } from "./env.js";
import { GeneralLogger, InitPinoLogger, LogLevel, LogType } from "./utils/logger.js";


InitPinoLogger()
const port = env.PORT;
const server = app.listen(port, () => {
  GeneralLogger(LogType.SERVICE, LogLevel.INFO, `Listening: http://localhost:${port}`);
});

server.on("error", (err) => {
  if ("code" in err && err.code === "EADDRINUSE") {
    GeneralLogger(LogType.SERVICE, LogLevel.ERROR, `Port ${env.PORT} is already in use. Please choose another port or stop the process using it.`);
  }
  else {
    GeneralLogger(LogType.SERVICE, LogLevel.ERROR, `Failed to start server: ${err}`);
  }
  process.exit(1);
});
