import { Collection } from "discord.js";
import { BaseEvent, DiscordEvent } from "@modules/events/DiscordEvent.ts";
import * as events from "@modules/events/index.ts";
import { Nite } from "@/Client.ts";

export class EventManager extends Collection<string, DiscordEvent<BaseEvent>> {
  constructor(private readonly client: Nite) {
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

  private deploy(eventInstances: DiscordEvent<BaseEvent>[]) {
    for (const instance of eventInstances) {
      if (!instance.data.name) {
        continue;
      }

      if (instance.data.runOnce) {
        this.client.once(instance.data.name, instance.execute.bind(instance));
        continue;
      }

      this.client.on(instance.data.name, instance.execute.bind(instance));
    }

    return this;
  }
}
