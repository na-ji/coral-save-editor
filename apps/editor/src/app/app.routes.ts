import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'editor' },
  {
    path: 'editor',
    loadComponent: () => import('./shell/shell.component').then((c) => c.ShellComponent),
    loadChildren: () =>
      import('./coral-island-editor/coral-island-editor.routes').then((m) => m.CORAL_ISLAND_EDITOR_ROUTES),
  },
];
