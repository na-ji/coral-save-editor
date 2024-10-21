export function editorFlatStruct<TValue extends Record<string, any>>(value: TValue) {
  return {
    Struct: value,
  } as const;
}
