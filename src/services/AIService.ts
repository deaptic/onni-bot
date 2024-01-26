import { OpenAI } from "openai";
import { getOpenAiApiToken } from "@constants/environments.ts";

export class AIService {
  private static instance: AIService | undefined;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new AIService();
    }
    return this.instance;
  }

  private readonly provider: OpenAI;

  constructor() {
    this.provider = new OpenAI({
      apiKey: getOpenAiApiToken(),
    });
  }

  private store = new Map<string, OpenAI.Beta.Threads.Thread>();

  private async replyToMessage(threadId: string, body: OpenAI.Beta.Threads.Runs.RunCreateParams) {
    const thread = await this.provider.beta.threads.runs.create(
      threadId,
      body,
    );
    return thread;
  }

  public async conversation(customId: string, message: OpenAI.Beta.Threads.Messages.MessageCreateParams) {
    if (!this.store.has(customId)) {
      const thread = await this.provider.beta.threads.create();
      this.store.set(customId, thread);
    }

    const thread = this.store.get(customId);
    if (!thread) return;

    await this.provider.beta.threads.messages.create(
      thread.id,
      message,
    );

    const run = await this.provider.beta.threads.runs.create(
      thread.id,
      { assistant_id: "asst_l1kW87QO3qi6Xt3DMiHG0qBA" },
    );

    let runStatus = await this.provider.beta.threads.runs.retrieve(
      thread.id,
      run.id,
    );

    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await this.provider.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await this.provider.beta.threads.messages.list(thread.id);

    const response = messages.data
      .filter((message) => message.run_id === run.id)
      .pop();

    return response?.content[0].text.value;
  }
}

export const AI = AIService.getInstance();
