import { ZERO_UUID } from '@coral-island/utils';

export function editorBasicStruct<TValue extends Record<string, any>>(
  value: TValue,
  structType: string,
  uuid: string = ZERO_UUID,
) {
  return {
    Struct: {
      value: {
        Struct: value,
      },
      struct_type: {
        Struct: structType,
      },
      struct_id: uuid,
    },
  } as const;
}
