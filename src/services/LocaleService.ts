import discord from "discord.js";
import i18n, { TranslateOptions } from "i18n";
import { join } from "path";

export class LocaleService {
  private static instance: LocaleService | undefined;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new LocaleService();
    }
    return this.instance;
  }

  constructor(private provider = i18n) {
    this.provider = i18n;
    this.provider.configure({
      locales: ["en", "fi"],
      directory: join(import.meta.dirname || "", "..", "locales"),
      defaultLocale: "en",
    });
  }

  public get() {
    return this.provider.getLocale();
  }

  public getAll() {
    return this.provider.getLocales();
  }

  public set(locale: string) {
    if (!this.getAll().includes(locale)) {
      return;
    }
    this.provider.setLocale(locale);
  }

  public translate(key: string | TranslateOptions, args = {}) {
    return this.provider.__(key, args);
  }

  public translateEvery(key: string) {
    const availableLocales = Object.values(discord.Locale)
      .filter((locale) => this.getAll().includes(locale))
      .map((locale) => locale.toString());

    const translations = this.provider.__h(key);

    const res: Record<string, string> = translations.reduce(
      (acc: Record<string, string>, translation: Record<string, string>) => {
        Object.keys(translation).forEach((locale) => {
          if (availableLocales.includes(locale)) {
            acc[locale] = translation[locale];
          }
        });

        return acc;
      },
      {},
    );

    return res;
  }

  public translatePlural(phrase: string, count: number) {
    return this.provider.__n(phrase, count);
  }
}

export const Locale = LocaleService.getInstance();
