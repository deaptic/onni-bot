import { Collection } from "discord.js";
import { BaseInteraction, DiscordInteraction } from "@modules/interactions/DiscordInteraction.ts";
import * as interactions from "@modules/interactions/index.ts";
import { Onni } from "@/Client.ts";
import { Logger } from "@services/LoggerService.ts";

export class InteractionManager extends Collection<
  string,
  DiscordInteraction<BaseInteraction>
> {
  constructor(private readonly client: Onni) {
    super();
    this.collect()
      .deploy([...this.values()])
      .then(() => {
        Logger.info(`Interactions deployed: ${this.size}`);
      })
      .catch((error) => {
        Logger.error(error.message, error);
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
