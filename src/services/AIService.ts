import { OpenAI } from "openai";
import { getOpenAiApiToken, getOpenAiCustomModelId } from "@constants/environments.ts";
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

  private cache = new Map<string, OpenAI.Beta.Threads.Thread>();

  public async getOrCreateThread(customId: string) {
    // Check if the thread is already in the cache
    if (this.cache.has(customId)) {
      return this.cache.get(customId);
    }

    // Create a new thread and add it to the cache
    const thread = await this.provider.beta.threads.create();
    this.cache.set(customId, thread);
    return thread;
  }

  public async sendMessageToThread(customId: string, message: OpenAI.Beta.Threads.Messages.MessageCreateParams) {
    // Get or create the thread
    const thread = await this.getOrCreateThread(customId);
    if (!thread) return;

    // Send the message to the thread
    await this.provider.beta.threads.messages.create(
      thread.id,
      message,
    );
  }

  public async getReplyToThread(customId: string) {
    // Get or create the thread
    const thread = await this.getOrCreateThread(customId);
    if (!thread) return;

    // Create a new run for the thread
    const run = await this.provider.beta.threads.runs.create(
      thread.id,
      { assistant_id: getOpenAiCustomModelId() },
    );

    // Get the status of the run
    let runStatus = await this.provider.beta.threads.runs.retrieve(
      thread.id,
      run.id,
    );

    // Wait for the run to complete
    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await this.provider.beta.threads.runs.retrieve(thread.id, run.id);

      if (runStatus.status === "cancelled" || runStatus.status === "failed" || runStatus.status === "expired") {
        throw new Error("Run failed");
      }
    }

    // Get all messages from the thread
    const messages = await this.provider.beta.threads.messages.list(thread.id);

    // Get the response from the thread
    const response = (messages.data
      .filter((message) => message.run_id === run.id)
      .pop()?.content[0] as MessageContentText).text.value;

    // Log the usage of the API
    Logger.info(`OpenAI API usage: ${runStatus.usage?.total_tokens || 0} tokens.`);

    // Check if the usage has exceeded 1000 tokens
    if (!runStatus.usage || runStatus.usage.total_tokens >= 1000) {
      // Delete old thread
      this.cache.delete(customId);
      await this.provider.beta.threads.del(thread.id);

      // TODO: Create summary of the thread and make a new one for cost saving
    }

    return response;
  }
}

export const AI = AIService.getInstance();
