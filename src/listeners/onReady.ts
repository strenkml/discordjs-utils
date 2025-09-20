import {
  Client,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord.js";

import Stumper from "stumper";
import { TextCommandManager } from "@managers/TextCommandManager";
import { ModalMenuManager } from "@managers/ModalMenuManager";
import { BotHealthManager } from "@managers/BotHealthManager";
import { ContextMenuCommandManager } from "@managers/ContextMenuManager";
import { SlashCommandManager } from "@managers/SlashCommandManager";

export const onReady = (client: Client, cb?: () => Promise<void>): void => {
  client.on("ready", async () => {
    readSlashCommands(client);
    readContextMenus(client);
    readTextCommands(client);
    readModals(client);

    if (cb) await cb();

    const healthManager = BotHealthManager.getInstance();
    healthManager.setHealthy(true);
    Stumper.info("Bot Online!", "common:onReady:clientReady");
  });
};

function readTextCommands(client: Client): void {
  const textCommands = TextCommandManager.getInstance().getCommands();
  textCommands.forEach((command) => {
    client.textCommands.set(`${command.prefix}${command.command}`, command);
  });

  Stumper.success(`Successfully loaded ${textCommands.size} text commands!`, "common:onReady:readTextCommands");
}

function readModals(client: Client): void {
  const modalMenus = ModalMenuManager.getInstance().getCommands();
  modalMenus.forEach((command) => {
    client.modals.set(command.name, command);
  });

  Stumper.success(`Successfully loaded ${client.modals.size} modals!`, "common:onReady:readModals");
}

function readSlashCommands(client: Client): void {
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  const slashCommandManager = SlashCommandManager.getInstance();
  const slashCommands = slashCommandManager.getCommands();
  slashCommands.forEach((command) => {
    commands.push(command.data.toJSON());
    client.slashCommands.set(command.name, command);
  });

  slashCommandManager.setRegistrationInfo(commands);
  Stumper.success(`Successfully loaded ${slashCommands.size} slash commands!`, "common:onReady:readSlashCommands");
}

function readContextMenus(client: Client): void {
  const menus: RESTPostAPIContextMenuApplicationCommandsJSONBody[] = [];

  const contextMenuManager = ContextMenuCommandManager.getInstance();
  const contextMenus = contextMenuManager.getCommands();
  contextMenus.forEach((menu) => {
    client.contextMenus.set(menu.name, menu);
    menus.push(menu.data.toJSON());
  });

  contextMenuManager.setRegistrationInfo(menus);
  Stumper.success(`Successfully loaded ${client.contextMenus.size} context menus!`, "common:onReady:readContextMenus");
}
