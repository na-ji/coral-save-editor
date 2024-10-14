import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { addDays, InGameDate, Seasons } from '@coral-island/utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SaveGameService } from '../../../core/save-game/save-game.service';
import { editorBasicStruct, editorEnum, editorInt } from '@editor/types';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';

@Component({
  selector: 'app-date-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatLabel, MatIcon, MatMiniFabButton],
  templateUrl: './date-form.component.html',
  styleUrl: './date-form.component.scss',
})
export class DateFormComponent implements OnInit {
  path = input.required<string>();

  formGroup = new FormGroup({
    day: new FormControl<InGameDate['day']>(1, { nonNullable: true }),
    season: new FormControl<InGameDate['season']>('Spring', { nonNullable: true }),
    year: new FormControl<InGameDate['year']>(1, { nonNullable: true }),
  });
  protected readonly Seasons = Seasons;
  #saveGameService = inject(SaveGameService);

  #destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.formGroup.patchValue({
      day: this.#saveGameService.get(this.path() + '.Struct.value.Struct.day_0.Int')() ?? 1,
      season:
        this.#saveGameService
          .get(this.path() + '.Struct.value.Struct.season_0.Enum.value')()
          ?.split('::')
          .pop() ?? 'Spring',
      year: this.#saveGameService.get(this.path() + '.Struct.value.Struct.year_0.Int')() ?? 1,
    });
    this.formGroup.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        const formRawValue = this.formGroup.getRawValue();
        const dateStruct = editorBasicStruct(
          {
            day_0: editorInt(formRawValue.day),
            season_0: editorEnum('EC_Season', formRawValue.season),
            year_0: editorInt(formRawValue.year),
          },
          'C_TimeDate',
        );

        this.#saveGameService.set(this.path(), dateStruct);
      },
    });
  }

  protected increaseDay(daysToAdd: number) {
    this.formGroup.patchValue(addDays(this.formGroup.getRawValue(), daysToAdd));
  }
}
