import app from "@Ciri/core/app";
import { env } from "@Ciri/core/env";
import { GeneralLogger, InitPinoLogger, LogLevel, LogType } from "@Ciri/core/utils/logger";
import { initMinio } from "@Ciri/s3/init";

InitPinoLogger();
void (async () => {
  try {
    await initMinio();
  }
  catch (e) {
    GeneralLogger(LogType.SERVICE, LogLevel.ERROR, `MinIO init failed: ${(e as Error).message}`);
  }

  const port = env.PORT;
  const server = app.listen(port, () => {
    GeneralLogger(LogType.SERVICE, LogLevel.INFO, `Listening: http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if ("code" in err && err.code === "EADDRINUSE") {
      GeneralLogger(LogType.SERVICE, LogLevel.ERROR, `Port ${port} is already in use. Please choose another port or stop the process using it.`);
    }
    else {
      GeneralLogger(LogType.SERVICE, LogLevel.ERROR, `Failed to start server: ${err}`);
    }
    process.exit(1);
  });
})();
