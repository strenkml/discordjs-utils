export {};

declare module "discord.js" {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
    textCommands: Collection<string, TextCommand>;
    modals: Collection<string, ModalMenu>;
    contextMenus: Collection<string, ContextMenuCommand>;
  }
}
