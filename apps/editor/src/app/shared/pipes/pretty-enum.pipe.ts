import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyEnum',
  standalone: true,
})
export class PrettyEnumPipe implements PipeTransform {
  transform(enumValue: string, delimiter: string = '::'): string {
    const parts = enumValue.split(delimiter);
    return parts[1] ?? parts[0];
  }
}
