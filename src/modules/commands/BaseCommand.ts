import { Bot } from "@/Client.ts";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export abstract class BaseCommand<I extends CommandInteraction> {
  public abstract readonly data: SlashCommandBuilder;

  constructor(protected readonly client: Bot) {
    this.execute = this.execute.bind(this);
  }

  public abstract execute(interaction: I): Promise<void> | void;
}
