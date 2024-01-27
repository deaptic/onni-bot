import { Events } from "discord.js";
import { EventBuilder } from "@builders/EventBuilder.ts";
import { DiscordEvent } from "@modules/events/DiscordEvent.ts";
import { Logger } from "@services/LoggerService.ts";

export class ReadyEvent extends DiscordEvent<Events.ClientReady> {
  public readonly data = new EventBuilder()
    .setName(Events.ClientReady)
    .setRunOnce(true);

  public execute() {
    Logger.info(`Logged in as ${this.client.user?.tag} (${this.client.user?.id})`);
  }
}
