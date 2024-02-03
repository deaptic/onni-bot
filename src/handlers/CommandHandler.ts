import { Collection } from "discord.js";
import { BaseCommand } from "@modules/commands/BaseCommand.ts";
import * as interactions from "@modules/commands/index.ts";
import { Bot } from "@/Client.ts";
import { Logger } from "@services/LoggerService.ts";
import { CommandInteraction } from "discord.js";

export class CommandHandler extends Collection<
  string,
  BaseCommand<CommandInteraction>
> {
  constructor(private readonly client: Bot) {
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
    interactionInstances: BaseCommand<CommandInteraction>[],
  ) {
    const data = interactionInstances.map((instance) => instance.data);

    await this.client.application?.commands.set(data);

    return this;
  }
}
