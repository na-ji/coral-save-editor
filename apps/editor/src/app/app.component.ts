import { Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FileHandlerComponent } from './file-handler/file-handler.component';
import { SaveGameService } from './core/save-game/save-game.service';
import { CoralIslandSaveGameService } from './coral-island-save-game/coral-island-save-game.service';
import { CoralIslandSaveGame } from './coral-island-save-game/coral-island-save-game.type';
import { PrimitiveFormPartComponent } from './form-parts/primitive-form-part/primitive-form-part.component';
import { PlayersListComponent } from './coral-island-save-game/players-list/players-list.component';

@Component({
  standalone: true,
  imports: [RouterModule, FileHandlerComponent, PrimitiveFormPartComponent, PlayersListComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
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
