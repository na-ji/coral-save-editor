import { Component, computed, inject, input } from '@angular/core';
import { EnumFormPartComponent } from '../../../form-parts/enum-form-part/enum-form-part.component';
import { CORAL_ISLAND_ENUMS, SaveGameEnum } from '@coral-island/enums';
import { SaveGameService } from '../../../core/save-game/save-game.service';

@Component({
  selector: 'app-enum-form',
  standalone: true,
  imports: [EnumFormPartComponent],
  templateUrl: './enum-form.component.html',
})
export class EnumFormComponent {
  path = input.required<string>();
  label = input.required<string>();

  #saveGameService = inject(SaveGameService);
  options = computed(() => {
    const pathResult: SaveGameEnum = this.#saveGameService.get(this.path())();
    return CORAL_ISLAND_ENUMS[pathResult.Enum.enum_type] ?? [];
  });
}
