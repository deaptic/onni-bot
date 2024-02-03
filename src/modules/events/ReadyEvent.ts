import { Events } from "discord.js";
import { BaseEvent } from "@modules/events/BaseEvent.ts";
import { Logger } from "@services/LoggerService.ts";

export class ReadyEvent extends BaseEvent<Events.ClientReady> {
  public readonly data = {
    name: Events.ClientReady,
    once: true,
  } as const;

  public execute() {
    Logger.info(`Logged in as ${this.client.user?.tag} (${this.client.user?.id})`);
  }
}
