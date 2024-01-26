import "https://deno.land/std@0.213.0/dotenv/load.ts";

import { Guard } from "@services/GuardService.ts";
import { Locale } from "@services/LocaleService.ts";

const getVariableByKey = (key: string) => {
  const value = Deno.env.get(key);
  Guard.Against.Null(value, Locale.translate(`${key}_NOT_FOUND`));
  return value;
};

export const getEnvironment = () => {
  return getVariableByKey("NODE_ENV");
};

export const getDiscordApiToken = () => {
  return getVariableByKey("DISCORD_API_TOKEN");
};

export const getOpenAiApiToken = () => {
  return getVariableByKey("OPENAI_API_TOKEN");
};

export const getRedisHost = () => {
  return getVariableByKey("REDIS_HOST");
};

export const getRedisPassword = () => {
  return getVariableByKey("REDIS_PASSWORD");
};

export const getRedisPort = () => {
  return getVariableByKey("REDIS_PORT");
};

export const getRedisUsername = () => {
  return getVariableByKey("REDIS_USERNAME");
};

export const getStringifyApiToken = () => {
  return getVariableByKey("STRINGIFY_API_TOKEN");
};
