import type ModalMenu from "../../models/ModalMenu";
import type SlashCommand from "../../models/SlashCommand";
import type TextCommand from "../../models/TextCommand";
import type { ContextMenuCommand } from "../../models/ContextMenuCommand";

export {};

declare module "discord.js" {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
    textCommands: Collection<string, TextCommand>;
    modals: Collection<string, ModalMenu>;
    contextMenus: Collection<string, ContextMenuCommand>;
  }
}
