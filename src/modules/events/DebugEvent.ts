import { Events } from "discord.js";
import { EventBuilder } from "@builders/EventBuilder.ts";
import { DiscordEvent } from "@modules/events/DiscordEvent.ts";

export class DebugEvent extends DiscordEvent<Events.Debug> {
  public data = new EventBuilder().setName(Events.Debug);

  public execute(_info: Events.Debug) {
  }
}
