import { ChatInputCommandInteraction, CommandInteraction, Events, Interaction } from "discord.js";
import { EventBuilder } from "@builders/EventBuilder.ts";
import { DiscordEvent } from "@modules/events/DiscordEvent.ts";
import { DiscordInteraction } from "@modules/interactions/DiscordInteraction.ts";
import { Locale } from "@services/LocaleService.ts";
import { Logger } from "@services/LoggerService.ts";

export class InteractionCreateEvent extends DiscordEvent<Events.InteractionCreate> {
  public readonly data = new EventBuilder().setName(Events.InteractionCreate);

  public execute(interaction: Interaction) {
    return this.handleInteraction(interaction);
  }

  // Interaction
  private handleInteraction(interaction: Interaction) {
    if (interaction.isCommand()) {
      return this.handleCommandInteraction(interaction);
    }
  }

  // CommandInteraction
  private handleCommandInteraction(interaction: CommandInteraction) {
    const module = this.client.interactions.get(interaction.commandName);
    if (!module) return;

    if (interaction.isChatInputCommand()) {
      return this.handleChatInputCommandInteraction(interaction, module)
        .then(() => {
          Logger.log(
            Locale.translate("INTERACTION_EXECUTE_SUCCESS_INTERACTION_USER", {
              interaction: interaction.commandName,
              user: `${interaction.user.tag} (${interaction.user.id})`,
            }),
          );
        })
        .catch((error) => {
          const newErrorMessage = Locale.translate(
            "INTERACTION_HANDLE_ERROR_INTERACTION",
            {
              interaction: interaction.commandName,
            },
          );
          Logger.error(error.message || newErrorMessage, error);

          interaction.reply({
            content: Locale.translate("INTERACTION_EXECUTE_ERROR"),
            ephemeral: true,
          });
        });
    }
  }

  // ChatInputCommandInteraction
  private async handleChatInputCommandInteraction(
    interaction: ChatInputCommandInteraction,
    module: DiscordInteraction<ChatInputCommandInteraction>,
  ) {
    return await module.execute(interaction);
  }
}
