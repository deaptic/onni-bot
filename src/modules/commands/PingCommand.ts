import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { BaseCommand } from "@modules/commands/BaseCommand.ts";

export class PingInteraction extends BaseCommand<ChatInputCommandInteraction> {
  public readonly data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!");

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "Pong! 🏓",
      ephemeral: true,
    });
  }
}
