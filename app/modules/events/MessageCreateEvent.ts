import { Events, Message } from "discord.js";
import { EventBuilder } from "@builders/EventBuilder.ts";
import { DiscordEvent } from "@modules/events/DiscordEvent.ts";
import { AI } from "@services/AIService.ts";
import { Logger } from "@services/LoggerService.ts";
import { clearTyping, startTyping } from "@utilities/message.ts";

const allowedGuilds = ["614160132712038469", "552089273579470849"];

export class MessageCreateEvent extends DiscordEvent<Events.MessageCreate> {
  public readonly data = new EventBuilder().setName(Events.MessageCreate);

  private async handleAIConversation(message: Message<true>) {
    // Guard clauses
    if (!allowedGuilds.includes(message.guild?.id ?? "")) return;
    if (message.author.bot) return;

    // Add message to AI thread
    const addMessageToAIThread = async (threadId: string, content: string) => {
      const username = message.author.username
        .replace(/\s+/g, "_")
        .replace(/[^\w\s]/gi, "");

      await AI.sendMessageToThread(threadId, {
        role: "user" as const,
        content: content,
        metadata: {
          user: username,
        },
      }).catch((error) => {
        Logger.error(`Error while trying to continue thread`, error);
      });
    };

    // Message is not meant to be replied by AI
    if (!message.mentions.has(this.client.user?.id ?? "")) {
      // Add message to AI thread if it's discord's thread and it exists in our store
      if (message.channel.isThread()) {
        const thread = AI.hasThread(message.channel.id);
        if (thread) {
          await addMessageToAIThread(message.channel.id, message.cleanContent);
        }
      }

      // RETURN BEFORE IT'S TOO LATE
      return;
    }

    // Get or create thread
    const thread = (message.channel.isThread() || message.channel.isVoiceBased())
      ? message.channel
      : await message.startThread({
        name: message.cleanContent,
        autoArchiveDuration: 60,
      });

    // Add message to AI conversation
    await addMessageToAIThread(thread.id, message.cleanContent);

    // Start typing indicator
    startTyping(thread);

    // Start conversation
    const response = await AI.getReplyToThread(thread.id).catch((error) => {
      Logger.error(`Error while trying to reply to a thread`, error);
    });

    // Stop typing indicator
    clearTyping(thread);

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
    if (message.guild) {
      await this.handleAIConversation(message as Message<true>);
    }
  }
}
