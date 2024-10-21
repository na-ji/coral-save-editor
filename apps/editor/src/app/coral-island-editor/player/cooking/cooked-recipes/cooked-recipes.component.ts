import { Component, inject } from '@angular/core';
import { CookingRecipe, DatabaseService, ItemIconComponent } from '@coral-guide/assets';
import { combineLatest, map, Observable } from 'rxjs';
import { NamePropertyFormPartComponent } from '../../../../form-parts/name-property-form-part/name-property-form-part.component';
import { SaveGameValuePipe } from '../../../../core/save-game/save-game-value.pipe';
import { AsyncPipe } from '@angular/common';
import { MatOption } from '@angular/material/autocomplete';
import { SaveGameService } from '../../../../core/save-game/save-game.service';
import { editorFlatStruct, editorInt, editorName } from '@editor/types';
import { PrimitiveFormPartComponent } from '../../../../form-parts/primitive-form-part/primitive-form-part.component';
import { MatLabel } from '@angular/material/form-field';
import { MatSelectTrigger } from '@angular/material/select';

type Option = { value: string; displayName: string; icon: string | null };

@Component({
  selector: 'app-cooked-recipes',
  standalone: true,
  imports: [
    NamePropertyFormPartComponent,
    SaveGameValuePipe,
    AsyncPipe,
    MatOption,
    ItemIconComponent,
    PrimitiveFormPartComponent,
    MatLabel,
    MatSelectTrigger,
  ],
  templateUrl: './cooked-recipes.component.html',
  styleUrl: './cooked-recipes.component.scss',
})
export class CookedRecipesComponent {
  cookedRecipesPath =
    'root.properties.SaveData_0.Struct.value.Struct.players_0.Array.value.Struct.value.0.Struct.recipeCooked_0.Array.value.Struct.value';
  recipeOptions: Observable<Option[]>;
  #saveGameService = inject(SaveGameService);
  #database = inject(DatabaseService);
  cookingRecipes$ = this.#database.fetchCookingRecipes$();
  failedDish$ = this.#database.fetchDatabaseItem$('item_80084');

  constructor() {
    console.log(this.#saveGameService.get(this.cookedRecipesPath)());
    this.recipeOptions = combineLatest([this.cookingRecipes$, this.failedDish$]).pipe(
      map(([recipes, failedDish]) => {
        const keys = Object.keys(recipes);

        const mergedRecipes = keys.reduce(
          (previousValue, currentValue) => [...previousValue, ...recipes[currentValue]],
          [] as CookingRecipe[],
        );

        const result: Option[] = mergedRecipes
          .map((recipe) => {
            const pascalCase = recipe.cookingKey.replaceAll(/([A-Z])/g, ' $1').trim();
            return {
              displayName: recipe.item.displayName,
              icon: recipe.item.iconName,
              value: pascalCase.charAt(0).toUpperCase() + pascalCase.slice(1).toLowerCase(),
            };
          })
          .sort((a, b) => a.displayName.localeCompare(b.displayName));

        result.push({
          value: failedDish.item.id,
          icon: failedDish.item.iconName,
          displayName: failedDish.item.displayName,
        });
        return result;
      }),
    );
  }

  addRecipe() {
    this.#saveGameService
      .get(this.cookedRecipesPath)()
      .push(
        editorFlatStruct({
          recipeName_0: editorName(''),
          quantity_0: editorInt(1),
        }),
      );
  }

  removeRecipe(index: number) {
    this.#saveGameService.get(this.cookedRecipesPath)().splice(index, 1);
  }
}
