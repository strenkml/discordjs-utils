import Stumper from "stumper";

export default async (cb?: () => Promise<void>): Promise<void> => {
  process.on("SIGINT", async (): Promise<void> => {
    Stumper.warning("Received SIGINT signal, shutting down...", "common:onSigInt");

    if (cb) await cb();

    process.exit(0);
  });
};
