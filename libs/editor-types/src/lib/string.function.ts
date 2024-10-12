export function editorString<TValue extends string>(value: TValue) {
  return {
    Str: value,
  } as const;
}
