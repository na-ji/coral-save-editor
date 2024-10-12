import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileHandlerComponent } from '../file-handler/file-handler.component';
import { PlayersListComponent } from '../coral-island-save-game/players-list/players-list.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, FileHandlerComponent, PlayersListComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {}
