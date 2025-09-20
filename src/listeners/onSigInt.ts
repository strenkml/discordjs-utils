import Stumper from "stumper";

export function onSigInt(cb?: () => Promise<void>): void {
  process.on("SIGINT", async (): Promise<void> => {
    Stumper.warning("Received SIGINT signal, shutting down...", "common:onSigInt");

    if (cb) await cb();

    process.exit(0);
  });
}
