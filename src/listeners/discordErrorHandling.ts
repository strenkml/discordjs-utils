import { Client } from "discord.js";
import Stumper from "stumper";

export const discordErrorHandling = (client: Client): void => {
  client.on("error", (error) => {
    Stumper.error(`${error.name}: ${error.message}`, "DiscordClientError");
  });
};
