import { OpenAI } from "openai";
import { getOpenAiApiToken } from "@constants/environments.ts";
import { MessageContentText } from "openai/resources";
import { Logger } from "@services/LoggerService.ts";

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

  public hasThread(customId: string) {
    return this.store.has(customId);
  }

  public async getOrCreateThread(customId: string) {
    if (this.store.has(customId)) {
      return this.store.get(customId);
    }

    const thread = await this.provider.beta.threads.create();
    this.store.set(customId, thread);
    return thread;
  }

  public async sendMessageToThread(customId: string, message: OpenAI.Beta.Threads.Messages.MessageCreateParams) {
    const thread = await this.getOrCreateThread(customId);
    if (!thread) return;

    await this.provider.beta.threads.messages.create(
      thread.id,
      message,
    );
  }

  public async getReplyToThread(customId: string) {
    const thread = await this.getOrCreateThread(customId);
    if (!thread) return;

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

    if ((runStatus.usage?.total_tokens || 1000) >= 1000) {
      Logger.warn(`OpenAI API usage exceeded 1000 tokens.`, runStatus.usage);
      const threadId = this.store.get(customId)?.id;
      if (threadId) {
        await this.provider.beta.threads.del(threadId);
        this.store.delete(customId);
      }
    }

    Logger.info(`OpenAI API usage: ${runStatus.usage?.total_tokens || 0} tokens.`);

    const messages = await this.provider.beta.threads.messages.list(thread.id);

    const response = messages.data
      .filter((message) => message.run_id === run.id)
      .pop();

    return (response?.content[0] as MessageContentText).text.value;
  }
}

export const AI = AIService.getInstance();
