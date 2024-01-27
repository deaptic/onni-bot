export class LoggerService {
  private static instance: LoggerService | undefined;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new LoggerService();
    }
    return this.instance;
  }

  private get timestamp() {
    return new Date().toISOString();
  }

  private readonly Colors = {
    Log: "\x1b[37m",
    Info: "\x1b[36m",
    Warn: "\x1b[33m",
    Error: "\x1b[31m",
    Debug: "\x1b[32m",
    Reset: "\x1b[0m",
  };

  private formatMessage(message: string, color: string) {
    return `${color}${this.timestamp}${this.Colors.Reset} ${message}`;
  }

  public log(message: string, ...data: unknown[]) {
    console.log(this.formatMessage(message, this.Colors.Log), ...data);
  }

  public info(message: string, ...data: unknown[]) {
    console.info(this.formatMessage(message, this.Colors.Info), ...data);
  }

  public warn(message: string, ...data: unknown[]) {
    console.warn(this.formatMessage(message, this.Colors.Warn), ...data);
  }

  public error(message: string, ...data: unknown[]) {
    console.error(this.formatMessage(message, this.Colors.Error), ...data);
  }

  public debug(message: string, ...data: unknown[]) {
    console.debug(this.formatMessage(message, this.Colors.Debug), ...data);
  }
}

export const Logger = LoggerService.getInstance();
