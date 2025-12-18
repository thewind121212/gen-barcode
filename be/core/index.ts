import app from "@Ciri/core/app";
import { GeneralLogger, InitPinoLogger, LogLevel, LogType } from "@Ciri/core/utils/logger";

InitPinoLogger();
const port = 9190;
const server = app.listen(port, () => {
  GeneralLogger(LogType.SERVICE, LogLevel.INFO, `Listening: http://localhost:${port}`);
});

server.on("error", (err) => {
  if ("code" in err && err.code === "EADDRINUSE") {
    GeneralLogger(LogType.SERVICE, LogLevel.ERROR, `Port 9190 is already in use. Please choose another port or stop the process using it.`);
  }
  else {
    GeneralLogger(LogType.SERVICE, LogLevel.ERROR, `Failed to start server: ${err}`);
  }
  process.exit(1);
});
