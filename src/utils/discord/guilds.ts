import { Guild } from "discord.js";
import { ClientManager } from "@managers/ClientManager";

export function getGuild(guildId: string): Guild | undefined {
  const client = ClientManager.getInstance().client;
  return client.guilds.cache.get(guildId);
}
