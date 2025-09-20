import Stumper from "stumper";

export default (uncaughtExceptionDB?: (err: Error) => Promise<void>): void => {
  // Process UnhandledRejection
  process.on("unhandledRejection", (err, p) => {
    Stumper.caughtError(err, "Unhandled Exception");
    Stumper.error(p, "Unhandled Exception");
  });

  // Process UncaughtException
  process.on("uncaughtException", async (err) => {
    Stumper.caughtError(err, "Uncaught Exception");

    if (uncaughtExceptionDB) await uncaughtExceptionDB(err);

    process.exit(1);
  });

  // Process Warning
  process.removeAllListeners("warning");
  process.on("warning", (warning) => {
    // Ignore warning about buffer.File
    if (warning.name === "ExperimentalWarning" && warning.message.includes("buffer.File")) {
      return;
    }
    Stumper.caughtWarning(warning, "Unhandled Warning");
  });
};
