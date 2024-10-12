import { Component, inject, Signal } from '@angular/core';
import { SaveGameService } from '../../core/save-game/save-game.service';
import { PrimitiveFormPartComponent } from '../../form-parts/primitive-form-part/primitive-form-part.component';
import { SaveGameValuePipe } from '../../core/save-game/save-game-value.pipe';
import { MoneyComponent } from '@coral-island/ui';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [PrimitiveFormPartComponent, SaveGameValuePipe, MoneyComponent, RouterLink, RouterLinkActive],
  templateUrl: './players-list.component.html',
})
export class PlayersListComponent {
  protected PLAYERS_ARRAY_PATH = 'root.properties.SaveData_0.Struct.value.Struct.players_0.Array.value.Struct.value';
  #saveGameService = inject(SaveGameService);

  players = this.#saveGameService.get(this.PLAYERS_ARRAY_PATH) as Signal<any[]>;
}
