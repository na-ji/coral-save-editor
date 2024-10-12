import { inject, Pipe, PipeTransform } from '@angular/core';
import { SaveGameService } from './save-game.service';

@Pipe({
  name: 'saveGameValue',
  standalone: true,
})
export class SaveGameValuePipe implements PipeTransform {
  #saveGameService = inject(SaveGameService);

  transform(value: string) {
    return this.#saveGameService.get(value)();
  }
}
