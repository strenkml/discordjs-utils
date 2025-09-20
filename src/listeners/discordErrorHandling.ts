import { Client } from "discord.js";
import Stumper from "stumper";

export default (client: Client, advancedDebug: boolean = false): void => {
  client.on("error", (error) => {
    Stumper.error(`${error.name}: ${error.message}`, "DiscordClientError");
  });

  client.on("warn", (warning) => {
    Stumper.warning(warning, "DiscordClientWarning");
  });

  client.on("debug", (debug) => {
    if (advancedDebug) {
      Stumper.debug(debug, "DiscordClientDebug");
    }
  });
};
