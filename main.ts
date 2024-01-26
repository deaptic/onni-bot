import { Locale } from "@services/LocaleService.ts";
import { Logger } from "@services/LoggerService.ts";
import { getDiscordApiToken, getEnvironment } from "@constants/environments.ts";
import { Onni } from "@/Client.ts";

Logger.info(
  Locale.translate("ENVIRONMENT_ENVIRONMENT", {
    environment: getEnvironment(),
  }),
);

new Onni().login(getDiscordApiToken()).catch((error) => {
  Logger.error(Locale.translate("LOGIN_ERROR"), error);
});
