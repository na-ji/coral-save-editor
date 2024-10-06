import { computed, Injectable, signal } from '@angular/core';
import { CoralIslandSaveGame } from './coral-island-save-game.type';

@Injectable({
  providedIn: 'root',
})
export class CoralIslandSaveGameService {
  saveGame = signal<null | undefined | CoralIslandSaveGame>(null);
  players = computed(
    () => this.saveGame()?.root.properties.SaveData_0.Struct.value.Struct.players_0.Array.value.Struct.value ?? [],
  );
}
