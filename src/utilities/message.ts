import { Message } from "discord.js";
import { Logger } from "@services/LoggerService.ts";

const typingMap = new Map<string, number>();

export const startTyping = (message: Message) => {
  message.channel.sendTyping().catch((error) => {
    Logger.error(`Error while trying to send typing`, error);
  });
  const interval = setInterval(() => {
    message.channel.sendTyping().catch((error) => {
      Logger.error(`Error while trying to send typing`, error);
    });
  }, 5000);
  typingMap.set(message.id, interval);
};

export const clearTyping = (message: Message) => {
  const interval = typingMap.get(message.id);
  if (interval) {
    clearInterval(interval);
    typingMap.delete(message.id);
  }
};
