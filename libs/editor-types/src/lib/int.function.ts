export function editorInt<TValue extends number>(value: TValue) {
  return {
    Int: value,
  } as const;
}
