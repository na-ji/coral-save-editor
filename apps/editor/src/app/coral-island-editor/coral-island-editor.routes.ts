import { CoralIslandEditorComponent } from './coral-island-editor.component';
import { Routes } from '@angular/router';

export const CORAL_ISLAND_EDITOR_ROUTES: Routes = [
  {
    path: '',
    component: CoralIslandEditorComponent,
    children: [
      {
        path: 'player/:index',
        loadComponent: () => import('./player/player.component').then((c) => c.PlayerComponent),
      },
    ],
  },
];
