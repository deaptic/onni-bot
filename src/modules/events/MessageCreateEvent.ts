import { Events, Message } from "discord.js";
import { EventBuilder } from "@builders/EventBuilder.ts";
import { DiscordEvent } from "@modules/events/DiscordEvent.ts";
import { AI } from "@services/AIService.ts";
import { Logger } from "@services/LoggerService.ts";
import { clearTyping, startTyping } from "@utilities/message.ts";

const allowedGuilds = ["614160132712038469", "552089273579470849"];

export class MessageCreateEvent extends DiscordEvent<Events.MessageCreate> {
  public readonly data = new EventBuilder().setName(Events.MessageCreate);

  private async handleAIConversation(message: Message) {
    // Authorization
    if (!allowedGuilds.includes(message.guild?.id ?? "")) return;
    if (message.author.bot) return;
    if (!message.mentions.has(this.client.user?.id ?? "")) return;

    // AI is not available between 12am and 10am
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 10) {
      await message.reply({
        content: "I'm sleeping right now. I'll be back at 10am.",
        allowedMentions: {
          repliedUser: true,
        },
      });
      return;
    }

    // Get or create thread
    const thread = message.channel.isThread() ? message.channel : await message.startThread({
      name: message.cleanContent,
      autoArchiveDuration: 60,
    });

    // Start typing indicator
    startTyping(message);

    // Start conversation
    const response = await AI.conversation(thread.id, {
      role: "user" as const,
      content: message.content,
    }).catch((error) => {
      Logger.error(`Error while trying to continue conversation`, error);
    });

    // Stop typing indicator
    clearTyping(message);

    // No response from AI
    if (!response) {
      await message.reply({
        content: "I'm sorry, I couldn't understand that.",
        allowedMentions: {
          repliedUser: true,
        },
      });
      return;
    }

    // AI response
    const chunks = response?.match(/(.|[\r\n]){1,2000}/g);

    for (const chunk of chunks ?? []) {
      if (message.channel.isThread()) {
        await message.reply({
          content: chunk,
          allowedMentions: {
            repliedUser: true,
          },
        });
        continue;
      }
      await thread.send({
        content: chunk,
      });
    }
  }

  public async execute(message: Message) {
    await this.handleAIConversation(message);
  }
}
