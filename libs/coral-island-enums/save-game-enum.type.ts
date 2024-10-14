import { CORAL_ISLAND_ENUMS } from './coral-island-enums.const';

export type SaveGameEnum<T extends keyof typeof CORAL_ISLAND_ENUMS = keyof typeof CORAL_ISLAND_ENUMS> = {
  Enum: {
    value: (typeof CORAL_ISLAND_ENUMS)[NoInfer<T>];
    enum_type: T;
  };
};
