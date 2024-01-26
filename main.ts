import { Locale } from "@services/LocaleService.ts";
import { Logger } from "@services/LoggerService.ts";
import { getDiscordApiToken, getEnvironment } from "@constants/environments.ts";
import { Nite } from "@/Client.ts";

Logger.info(
  Locale.translate("ENVIRONMENT_ENVIRONMENT", {
    environment: getEnvironment(),
  }),
);

new Nite().login(getDiscordApiToken()).catch((error) => {
  Logger.error(Locale.translate("LOGIN_ERROR"), error);
});
