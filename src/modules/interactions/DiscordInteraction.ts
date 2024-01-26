import { Interaction } from "discord.js";
import { InteractionBuilder } from "@builders/InteractionBuilder.ts";
import { Nite } from "@/Client.ts";

export type BaseInteraction = Interaction;

export abstract class DiscordInteraction<I extends BaseInteraction> {
  public abstract readonly data: InteractionBuilder;

  constructor(protected readonly client: Nite) {
    this.execute = this.execute.bind(this);
  }

  public abstract execute(interaction: I): Promise<void> | void;
}
