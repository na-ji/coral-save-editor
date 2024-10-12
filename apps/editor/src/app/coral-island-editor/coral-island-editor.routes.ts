import { CoralIslandEditorComponent } from './coral-island-editor.component';
import { Routes } from '@angular/router';

export const CORAL_ISLAND_EDITOR_ROUTES: Routes = [
  {
    path: '',
    component: CoralIslandEditorComponent,
    children: [
      {
        path: 'world',
        loadComponent: () => import('./world/world.component').then((c) => c.WorldComponent),
      },
      {
        path: 'player/:index',
        loadComponent: () => import('./player/player.component').then((c) => c.PlayerComponent),
      },
    ],
  },
];
