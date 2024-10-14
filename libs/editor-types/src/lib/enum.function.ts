export function editorEnum<TType extends string, TValue extends string>(type: TType, value: TValue) {
  const enumValue = value.startsWith(type) ? value : `${type}::${value}`;
  return {
    Enum: {
      value: enumValue,
      enum_type: `${type}`,
    },
  } as const;
}
