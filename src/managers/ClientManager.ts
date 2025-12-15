import { Client } from "discord.js";
import { Singleton } from "@models/Singleton";

export class ClientManager extends Singleton {
  readonly client: Client;

  constructor(client: Client) {
    super();
    this.client = client;
  }
}
