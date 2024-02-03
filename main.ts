import { Logger } from "@services/LoggerService.ts";
import { getDiscordApiToken, getEnvironment } from "@constants/environments.ts";
import { Bot } from "@/Client.ts";

Logger.info(`Environment: ${getEnvironment()}`);

new Bot().login(getDiscordApiToken()).catch((error) => {
  Logger.error(error.message, error);
});

// Workaround for ping service
const handler = () => {
  return new Response("OK", {
    status: 200,
  });
};

Deno.serve({ port: 80 }, handler)
