import { Client } from "discord.js";

import Stumper from "stumper";
import { BotHealthManager } from "@managers/BotHealthManager";
import { readContextMenus, readModals, readSlashCommands, readTextCommands } from "@utils/registerCommands";

export function onReady(client: Client, cb?: (client: Client) => Promise<void>): void {
  client.on("ready", async () => {
    readSlashCommands(client);
    readContextMenus(client);
    readTextCommands(client);
    readModals(client);

    if (cb) await cb(client);

    const healthManager = BotHealthManager.getInstance();
    healthManager.setHealthy(true);
    Stumper.info("Bot Online!", "common:onReady:clientReady");
  });
}
