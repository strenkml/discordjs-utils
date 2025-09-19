import {
  Client,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import Stumper from "stumper";
import { ClientManager } from "@managers/ClientManager";
import { Time } from "./Time";
import { SlashCommandManager } from "@managers/SlashCommandManager";
import { ContextMenuCommandManager } from "@managers/ContextMenuManager";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function withTimeout(promise: Promise<any>, ms: number): Promise<any> {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${Time.getFormattedTimeFromMilliseconds(ms)}`)), ms)
  );
  return Promise.race([promise, timeout]);
}
