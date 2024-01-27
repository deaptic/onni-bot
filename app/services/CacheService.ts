import { Redis } from "ioredis";

export class CacheService {
  private static instance: CacheService | undefined;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new CacheService();
    }
    return this.instance;
  }

  private provider: Redis;

  constructor() {
    this.provider = new Redis();
  }

  public async get<Model>(key: string): Promise<Model | null> {
    const response = await this.provider.get(key).catch(console.error);
    return response ? (JSON.parse(response) as Model) : null;
  }

  public async set<Model>(key: string, value: Model, ttl: number): Promise<void> {
    await this.provider.set(key, JSON.stringify(value), "EX", ttl).catch(console.error);
  }
}

export const Cache = CacheService.getInstance();
