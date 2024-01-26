import { Events, Message } from "discord.js";
import { EventBuilder } from "@builders/EventBuilder.ts";
import { DiscordEvent } from "@modules/events/DiscordEvent.ts";
import { AI } from "@services/AIService.ts";
import { Guard } from "@services/GuardService.ts";
import { Logger } from "@services/LoggerService.ts";
import { clearTyping, startTyping } from "@utilities/message.ts";

const allowedGuilds = ["614160132712038469", "552089273579470849"];

export class MessageCreateEvent extends DiscordEvent<Events.MessageCreate> {
  public readonly data = new EventBuilder().setName(Events.MessageCreate);

  private authorization(message: Message) {
    // Only allow in specific guilds
    Guard.Against.False(allowedGuilds.includes(message.guild?.id ?? ""));

    // Only allow if user is not a bot
    Guard.Against.True(message.author.bot);

    // Only allow if self is available
    Guard.Against.Null(this.client.user);

    // Only allow if message mentions self
    Guard.Against.False(message.mentions.has(this.client.user.id));

    return true;
  }

  public async execute(message: Message) {
    if (!this.authorization(message)) return;

    const context = {
      role: "user" as const,
      content: message.content,
    };

    startTyping(message);

    const response = await AI.conversation(message.channel.id, context).catch((error) => {
      Logger.error(`Error while trying to continue conversation`, error);
    });

    clearTyping(message);

    const chunks = response?.match(/(.|[\r\n]){1,2000}/g);

    for (const chunk of chunks ?? []) {
      await message.reply({
        content: chunk,
        allowedMentions: {
          repliedUser: true,
        },
      });
    }
  }
}
