import { Events } from "discord.js";
import { EventBuilder } from "@builders/EventBuilder.ts";
import { DiscordEvent } from "@modules/events/DiscordEvent.ts";
import { Logger } from "@services/LoggerService.ts";

export class WarnEvent extends DiscordEvent<Events.Warn> {
  public readonly data = new EventBuilder().setName(Events.Warn);

  public execute(info: string) {
    Logger.warn(info);
  }
}
