import { ChatInputCommandInteraction } from "discord.js";
import { InteractionBuilder } from "@builders/InteractionBuilder.ts";
import { DiscordInteraction } from "@modules/interactions/DiscordInteraction.ts";

export class PingInteraction extends DiscordInteraction<ChatInputCommandInteraction> {
  public readonly data = new InteractionBuilder()
    .setName("ping")
    .setDescription("Replies with pong!");

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "Pong! 🏓",
      ephemeral: true,
    });
  }
}
