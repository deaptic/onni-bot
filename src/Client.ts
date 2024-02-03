import { Client, GatewayIntentBits } from "discord.js";
import { EventHandler } from "@/handlers/EventHandler.ts";
import { CommandHandler } from "@/handlers/CommandHandler.ts";

export class Bot extends Client {
  public readonly events = new EventHandler(this);
  public readonly commands = new CommandHandler(this);

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
      ],
    });
  }
}
