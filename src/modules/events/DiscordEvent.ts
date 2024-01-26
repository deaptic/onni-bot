import { ClientEvents } from "discord.js";
import { EventBuilder } from "@builders/EventBuilder.ts";
import { Onni } from "@/Client.ts";

export type BaseEvent = keyof ClientEvents;
export abstract class DiscordEvent<E extends BaseEvent> {
  public abstract readonly data: EventBuilder;

  constructor(protected readonly client: Onni) {
    this.execute = this.execute.bind(this);
  }

  public abstract execute(..._args: ClientEvents[E]): Promise<void> | void;
}
