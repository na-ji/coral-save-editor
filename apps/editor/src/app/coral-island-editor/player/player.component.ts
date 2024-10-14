import { Component, computed, input } from '@angular/core';
import { PlayerInfoComponent } from './player-info/player-info.component';
import { SaveGameValuePipe } from '../../core/save-game/save-game-value.pipe';
import { CardComponent } from '@coral-island/ui';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [PlayerInfoComponent, SaveGameValuePipe, CardComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent {
  index = input.required();
  #PLAYERS_ARRAY_PATH = 'root.properties.SaveData_0.Struct.value.Struct.players_0.Array.value.Struct.value';
  playerPath = computed(() => this.#PLAYERS_ARRAY_PATH + '.' + this.index() + '.Struct');
}
