import { Logger } from "@services/LoggerService.ts";
import { getDiscordApiToken, getEnvironment } from "@constants/environments.ts";
import { Onni } from "@/Client.ts";

Logger.info(`Environment: ${getEnvironment()}`);

new Onni().login(getDiscordApiToken()).catch((error) => {
  Logger.error(error.message, error);
});
