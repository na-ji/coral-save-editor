import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveGameService } from '../core/save-game/save-game.service';

@Component({
  selector: 'app-file-handler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-handler.component.html',
  styleUrl: './file-handler.component.css',
})
export class FileHandlerComponent {
  #saveGameService = inject(SaveGameService);

  parseSaveGame($event: Event) {
    const files = ($event.target as HTMLInputElement).files;

    const file = files?.item(0);

    if (file) this.#saveGameService.parseSaveGame(file);
  }
}
