import { ChatInputCommandInteraction } from "discord.js";
import { InteractionBuilder } from "@builders/InteractionBuilder.ts";
import { DiscordInteraction } from "@modules/interactions/DiscordInteraction.ts";
import { Locale } from "@services/LocaleService.ts";

export class PingInteraction extends DiscordInteraction<ChatInputCommandInteraction> {
  public readonly data = new InteractionBuilder()
    .setName("ping")
    .setDescription("COMMAND_PING_DESCRIPTION");

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: Locale.translate("COMMAND_PING_RESPONSE"),
      ephemeral: true,
    });
  }
}
