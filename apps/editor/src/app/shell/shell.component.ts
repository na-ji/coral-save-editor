import { Component, effect, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FileHandlerComponent } from '../file-handler/file-handler.component';
import { PlayersListComponent } from '../coral-island-editor/players-list/players-list.component';
import { SaveGameService } from '../core/save-game/save-game.service';
import { CoralIslandSaveGameService } from '../coral-island-save-game/coral-island-save-game.service';
import { CoralIslandSaveGame } from '../coral-island-save-game/coral-island-save-game.type';
import { CardComponent } from '@coral-island/ui';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, FileHandlerComponent, PlayersListComponent, RouterLink, RouterLinkActive, CardComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  #saveGameService = inject(SaveGameService);
  status = this.#saveGameService.status;
  decodedData = this.#saveGameService.decodedData;

  #coralIslandSaveGameService = inject(CoralIslandSaveGameService);

  constructor() {
    effect(
      () => {
        const data = this.decodedData();
        this.#coralIslandSaveGameService.saveGame.set(data as CoralIslandSaveGame | null | undefined);
      },
      { allowSignalWrites: true },
    );
  }

  save() {
    this.#saveGameService.save();
  }
}
