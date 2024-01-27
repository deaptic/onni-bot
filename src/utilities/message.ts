import { TextBasedChannel } from "discord.js";
import { Logger } from "@services/LoggerService.ts";

const typingMap = new Map<string, number>();

export const startTyping = (textChannel: TextBasedChannel) => {
  textChannel.sendTyping().catch((error) => {
    Logger.error(`Error while trying to send typing`, error);
  });
  const interval = setInterval(() => {
    textChannel.sendTyping().catch((error) => {
      Logger.error(`Error while trying to send typing`, error);
    });
  }, 5000);
  typingMap.set(textChannel.id, interval);
};

export const clearTyping = (textChannel: TextBasedChannel) => {
  const interval = typingMap.get(textChannel.id);
  if (interval) {
    clearInterval(interval);
    typingMap.delete(textChannel.id);
  }
};
