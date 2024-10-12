export function editorEnum<TType extends string, TValue extends string>(type: TType, value: TValue) {
  return {
    Enum: {
      value: `${type}::${value}`,
      enum_type: `${type}`,
    },
  } as const;
}
