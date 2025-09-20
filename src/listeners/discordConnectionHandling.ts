import { Client } from "discord.js";
import Stumper from "stumper";

export function discordConnectionHandling(client: Client, advancedDebug: boolean = false): void {
  client.rest.on("response", (res) => {
    if (advancedDebug) {
      Stumper.debug(`Method: ${res.method}  Path: ${res.path}`, "[REST response]");
    }
  });

  client.rest.on("rateLimited", (info) => {
    Stumper.warning(info, "[RateLimited]");
  });
}
