import {
  Client,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import Stumper from "stumper";
import { ClientManager } from "@managers/ClientManager";
import { SlashCommandManager } from "@managers/SlashCommandManager";
import { ContextMenuCommandManager } from "@managers/ContextMenuManager";
import { ModalMenuManager } from "@managers/ModalMenuManager";
import { TextCommandManager } from "@managers/TextCommandManager";
import { withTimeout } from "./sleep";

export async function readAndRegisterCommands(guildId: string, token: string): Promise<void> {
  const client = ClientManager.getInstance().client;

  const slashCommandManager = SlashCommandManager.getInstance();
  const contextMenuManager = ContextMenuCommandManager.getInstance();

  const slashCommands = slashCommandManager.getRegistrationInfo();
  const contextMenus = contextMenuManager.getRegistrationInfo();

  const commands = [...slashCommands, ...contextMenus];
  Stumper.info(
    `Registering ${commands.length} commands...`,
    "registerCommands:registerCommands:readAndRegisterCommands"
  );
  await registerAllCommands(client, commands, guildId, token);
}

async function registerAllCommands(
  client: Client,
  commands: (RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody)[],
  guildId: string,
  token: string
): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(token);

  if (!client.user) {
    Stumper.error("Client user not found", "registerCommands:registerCommands:registerAllCommands");
    throw new Error("Client user not found");
  }

  const route = Routes.applicationGuildCommands(client.user.id, guildId);

  try {
    await withTimeout(rest.put(route, { body: commands }), 10 * 60 * 1000);
    Stumper.success("Successfully registered commands.`", "registerCommands:registerCommands:registerAllCommands");
  } catch (err) {
    Stumper.error("Error registering commands!", "registerCommands:registerCommands:registerAllCommands");
    Stumper.caughtError(err, "registerCommands:registerCommands:registerAllCommands");
    if (err instanceof Error && err.message.includes("Request timed out")) {
      // Do nothing
    } else {
      throw err;
    }
  }
}

export function readTextCommands(client: Client): void {
  const textCommands = TextCommandManager.getInstance().getCommands();
  textCommands.forEach((command) => {
    client.textCommands.set(`${command.prefix}${command.command}`, command);
  });

  Stumper.success(`Successfully loaded ${textCommands.size} text commands!`, "common:onReady:readTextCommands");
}

export function readModals(client: Client): void {
  const modalMenus = ModalMenuManager.getInstance().getCommands();
  modalMenus.forEach((command) => {
    client.modals.set(command.name, command);
  });

  Stumper.success(`Successfully loaded ${client.modals.size} modals!`, "common:onReady:readModals");
}

export function readSlashCommands(client: Client): void {
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

export function readContextMenus(client: Client): void {
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

export function readAllCommands(client: Client): void {
  readSlashCommands(client);
  readContextMenus(client);
  readTextCommands(client);
  readModals(client);
}
