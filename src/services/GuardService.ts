type GuardServiceType = {
  Against: {
    Null: (value: unknown, message?: string) => asserts value is NonNullable<typeof value>;
    True: (value: boolean, message?: string) => asserts value is false;
    False: (value: boolean, message?: string) => asserts value is true;
  };
};

export class GuardService implements GuardServiceType {
  private static instance: GuardService | undefined;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new GuardService();
    }
    return this.instance;
  }

  public Against = {
    Null: (value: unknown, message?: string): asserts value is NonNullable<typeof value> => {
      if (value === null || value === undefined) {
        throw new Error(message || "GUARD_AGAINTS_NULL");
      }
    },

    True: (value: boolean, message?: string): asserts value is false => {
      if (value) {
        throw new Error(message || "GUARD_AGAINTS_TRUE");
      }
    },

    False: (value: boolean, message?: string): asserts value is true => {
      if (!value) {
        throw new Error(message || "GUARD_AGAINTS_FALSE");
      }
    },
  };
}

export const Guard: GuardServiceType = GuardService.getInstance();
