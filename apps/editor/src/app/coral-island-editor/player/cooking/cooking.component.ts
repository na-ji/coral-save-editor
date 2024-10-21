import { Component } from '@angular/core';
import { CookedRecipesComponent } from './cooked-recipes/cooked-recipes.component';
import { CardComponent } from '@coral-island/ui';
import { PlayerInfoComponent } from '../player-info/player-info.component';

@Component({
  selector: 'app-cooking',
  standalone: true,
  imports: [CookedRecipesComponent, CardComponent, PlayerInfoComponent],
  templateUrl: './cooking.component.html',
  styleUrl: './cooking.component.scss',
})
export class CookingComponent {}
