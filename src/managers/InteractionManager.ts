import { Collection } from "discord.js";
import { BaseInteraction, DiscordInteraction } from "@modules/interactions/DiscordInteraction.ts";
import * as interactions from "@modules/interactions/index.ts";
import { Nite } from "@/Client.ts";
import { Locale } from "@services/LocaleService.ts";
import { Logger } from "@services/LoggerService.ts";

export class InteractionManager extends Collection<
  string,
  DiscordInteraction<BaseInteraction>
> {
  constructor(private readonly client: Nite) {
    super();
    this.collect()
      .deploy([...this.values()])
      .then(() => {
        Logger.info(
          Locale.translate("INTERACTION_DEPLOY_SUCCESS_COUNT", {
            count: this.size,
          }),
        );
      })
      .catch((error) => {
        Logger.error(Locale.translate("INTERACTION_DEPLOY_ERROR"), error);
      });
  }

  private collect() {
    for (const InteractionConstructor of Object.values(interactions)) {
      const instance = new InteractionConstructor(this.client);
      this.set(instance.data.name, instance);
    }

    return this;
  }

  private async deploy(
    interactionInstances: DiscordInteraction<BaseInteraction>[],
  ) {
    const data = interactionInstances.map((instance) => instance.data);

    await this.client.application?.commands.set(data);

    return this;
  }
}
