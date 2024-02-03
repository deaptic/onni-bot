import { ChatInputCommandInteraction, CommandInteraction, Events, Interaction } from "discord.js";
import { BaseEvent } from "@modules/events/BaseEvent.ts";
import { BaseCommand } from "@modules/commands/BaseCommand.ts";
import { Logger } from "@services/LoggerService.ts";

export class InteractionCreateEvent extends BaseEvent<Events.InteractionCreate> {
  public readonly data = {
    name: Events.InteractionCreate,
  } as const;

  public execute(interaction: Interaction) {
    return this.handleInteraction(interaction);
  }

  private handleInteraction(interaction: Interaction) {
    if (interaction.isCommand()) {
      this.handleCommandInteraction(interaction);
    }
  }

  private handleCommandInteraction(interaction: CommandInteraction) {
    const command = this.client.commands.get(interaction.commandName);
    if (!command) return;

    if (interaction.isChatInputCommand()) {
      this.handleChatInputCommandInteraction(interaction, command);
    }
  }

  private async handleChatInputCommandInteraction(
    interaction: ChatInputCommandInteraction,
    command: BaseCommand<ChatInputCommandInteraction>,
  ) {
    await command.execute(interaction)?.catch((error) => {
      Logger.error(`Error while trying to execute ChatInputCommand: ${interaction.commandName}`, error);
    });
  }
}
