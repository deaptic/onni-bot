import { Collection } from "discord.js";
import { BaseEvent } from "@modules/events/BaseEvent.ts";
import * as events from "@modules/events/index.ts";
import { Bot } from "@/Client.ts";
import { ClientEvents } from "discord.js";

export class EventHandler extends Collection<string, BaseEvent<keyof ClientEvents>> {
  constructor(private readonly client: Bot) {
    super();
    this.collect().deploy([...this.values()]);
  }

  private collect() {
    for (const EventConstructor of Object.values(events)) {
      const instance = new EventConstructor(this.client);

      if (!instance.data.name) {
        continue;
      }

      this.set(instance.data.name, instance);
    }

    return this;
  }

  private deploy(eventInstances: BaseEvent<keyof ClientEvents>[]) {
    for (const instance of eventInstances) {
      if (!instance.data.name) {
        continue;
      }

      if (instance.data.once) {
        this.client.once(instance.data.name, instance.execute.bind(instance));
        continue;
      }

      this.client.on(instance.data.name, instance.execute.bind(instance));
    }

    return this;
  }
}
