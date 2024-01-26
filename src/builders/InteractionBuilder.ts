import { SlashCommandBuilder } from "discord.js";
import { Locale } from "@services/LocaleService.ts";

export class InteractionBuilder extends SlashCommandBuilder {
  public setName(key: string): this {
    super.setNameLocalizations(Locale.translateEvery(key));
    super.setName(Locale.translate(key));
    return this;
  }

  public setDescription(key: string): this {
    super.setDescriptionLocalizations(Locale.translateEvery(key));
    super.setDescription(Locale.translate(key));
    return this;
  }
}
