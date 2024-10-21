export function editorName<TValue extends string>(value: TValue) {
  return {
    Name: value,
  } as const;
}
