import { ClientEvents } from "discord.js";

export class EventBuilder {
  private _name: keyof ClientEvents | undefined;
  private _runOnce = false;

  public get name(): keyof ClientEvents | undefined {
    return this._name;
  }

  public setName(name: keyof ClientEvents) {
    this._name = name;
    return this;
  }

  public get runOnce(): boolean {
    return this._runOnce;
  }

  public setRunOnce(runOnce: boolean) {
    this._runOnce = runOnce;
    return this;
  }
}
