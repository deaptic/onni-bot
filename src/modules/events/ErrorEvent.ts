import { Events } from "discord.js";
import { EventBuilder } from "@builders/EventBuilder.ts";
import { DiscordEvent } from "@modules/events/DiscordEvent.ts";
import { Logger } from "@services/LoggerService.ts";

export class ErrorEvent extends DiscordEvent<Events.Error> {
  public readonly data = new EventBuilder().setName(Events.Error);

  public execute(error: Error) {
    Logger.error("An error event", error);
  }
}
