import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SaveGameService } from '../../core/save-game/save-game.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { PrettyEnumPipe } from '../../shared/pipes/pretty-enum.pipe';
import { SaveGameEnum } from '@coral-island/enums';
import { editorEnum } from '@editor/types';

@Component({
  selector: 'app-enum-form-part',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatLabel, PrettyEnumPipe],
  templateUrl: './enum-form-part.component.html',
  styleUrl: './enum-form-part.component.scss',
})
export class EnumFormPartComponent<T extends string> implements OnInit {
  path = input.required<string>();
  label = input.required<string>();
  options = input.required<readonly T[]>();

  protected formControl = new FormControl();
  #destroyRef = inject(DestroyRef);
  #saveGameService = inject(SaveGameService);

  ngOnInit(): void {
    const enumValue: SaveGameEnum = this.#saveGameService.get(this.path())();
    this.formControl.setValue(enumValue.Enum.value, { emitEvent: false });
    this.formControl.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: (formValue) => {
        this.#saveGameService.set(this.path(), editorEnum(enumValue.Enum.enum_type, formValue));
      },
    });
  }
}
