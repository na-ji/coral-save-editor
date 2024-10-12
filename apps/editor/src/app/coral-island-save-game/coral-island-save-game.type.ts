/**
 * Save game type with extracted types for the editor. Type does *not* include all types, only the ones essential for
 * the purpose of this editor.
 */
export type CoralIslandSaveGame = {
  root: {
    properties: {
      SaveData_0: {
        Struct: {
          value: {
            Struct: {
              currentDate_0: {
                Struct: {
                  value: {
                    Struct: {
                      day_0: {
                        Int: number;
                      };
                    };
                  };
                };
              };
              players_0: {
                Array: {
                  value: {
                    Struct: {
                      value: {
                        Struct: {
                          playerInfo_0: {
                            Struct: {
                              value: {
                                Struct: {
                                  Name_0: {
                                    Str: 'Alex';
                                  };
                                };
                              };
                            };
                          };
                        };
                      }[];
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
};
