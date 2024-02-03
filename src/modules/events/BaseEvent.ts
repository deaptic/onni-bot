import { ClientEvents } from "discord.js";
import { Bot } from "@/Client.ts";

export abstract class BaseEvent<E extends keyof ClientEvents> {
  public abstract readonly data: {
    name: E;
    once?: boolean;
  };

  constructor(protected readonly client: Bot) {
    this.execute = this.execute.bind(this);
  }

  public abstract execute(..._args: ClientEvents[E]): Promise<void> | void;
}
