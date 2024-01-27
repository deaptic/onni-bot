import { Client, GatewayIntentBits } from "discord.js";
import { EventManager } from "@managers/EventManager.ts";
import { InteractionManager } from "@managers/InteractionManager.ts";

export class Onni extends Client {
  public readonly events = new EventManager(this);
  public readonly interactions = new InteractionManager(this);

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
