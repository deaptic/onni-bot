import { Events, Message } from "discord.js";
import { BaseEvent } from "@modules/events/BaseEvent.ts";
import { AI } from "@services/AIService.ts";
import { Logger } from "@services/LoggerService.ts";
import { clearTyping, startTyping } from "@utilities/message.ts";

export class MessageCreateEvent extends BaseEvent<Events.MessageCreate> {
  public readonly data = {
    name: Events.MessageCreate,
  } as const;

  private async handleAIConversation(message: Message<true>) {
    // Bot cannot reply to itself
    if (message.author.bot) return;

    // We don't want to reply to messages that don't mention the bot
    if (!message.mentions.has(this.client.user?.id ?? "")) {
      // Check if the message is a thread and creator of the thread is the bot itself
      if (message.channel.isThread() && message.channel.author?.id === this.client.user?.id) {
        // Add message to AI's thread
        await AI.sendMessageToThread(message.channel.id, {
          role: "user" as const,
          content: message.cleanContent,
        });
      }

      // We don't want to continue any further
      return;
    }

    // Get current thread or make a new one if necessary
    const channel = (message.channel.isThread() || message.channel.isVoiceBased())
      ? message.channel
      : await message.startThread({
        name: message.cleanContent.substring(0, 100),
        autoArchiveDuration: 60,
      }) || message.channel;

    // Add message to AI's thread
    await AI.sendMessageToThread(channel.id, {
      role: "user" as const,
      content: message.cleanContent,
    });

    // Start typing indicator on the channel
    startTyping(channel);

    // Get AI's response to the current thread
    const response = await AI.getReplyToThread(channel.id);

    // Stop typing indicator on the channel
    clearTyping(channel);

    // Chunk the response into 2000 characters each
    const chunks = response?.match(/(.|[\r\n]){1,2000}/g);

    // Send all the message chunks to the channel one by one
    for (const chunk of chunks ?? []) {
      const content = chunk || "I'm sorry, I couldn't understand that.";

      // If the message is a thread, reply to the message
      if (message.channel.isThread()) {
        await message.reply({
          content,
          allowedMentions: {
            repliedUser: true,
          },
        });
        continue;
      }

      // If the message is a voice based channel, send the message to the channel
      await channel.send({
        content,
      });
    }
  }

  public async execute(message: Message) {
    if (message.guild) {
      await this.handleAIConversation(message as Message<true>).catch((error) => {
        Logger.error(`Error while trying to handle AI conversation`, error);
      });
    }
  }
}
