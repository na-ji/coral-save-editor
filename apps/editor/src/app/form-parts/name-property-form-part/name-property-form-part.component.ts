import { Component, contentChild, contentChildren, DestroyRef, inject, input, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { JsonPipe, NgComponentOutlet, NgForOf, NgTemplateOutlet } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SaveGameService } from '../../core/save-game/save-game.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { editorName } from '@editor/types';
import { SaveGameValuePipe } from '../../core/save-game/save-game-value.pipe';
import { MatOption } from '@angular/material/autocomplete';
import { BypassSecurityTrustHtmlPipe } from '@coral-island/utils';

@Component({
  selector: 'app-name-property-form-part',
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    NgForOf,
    JsonPipe,
    NgTemplateOutlet,
    MatLabel,
    SaveGameValuePipe,
    ReactiveFormsModule,
    NgComponentOutlet,
    BypassSecurityTrustHtmlPipe,
  ],
  templateUrl: './name-property-form-part.component.html',
  styleUrl: './name-property-form-part.component.scss',
})
export class NamePropertyFormPartComponent implements OnInit {
  path = input.required<string>();
  options = contentChildren(MatOption);
  label = contentChild(MatLabel, { descendants: true });
  protected formControl = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] });
  #destroyRef = inject(DestroyRef);
  #saveGameService = inject(SaveGameService);

  ngOnInit(): void {
    let enumValue: ReturnType<typeof editorName> | undefined = this.#saveGameService.get(this.path())();
    if (!enumValue) {
      enumValue = editorName('');
    }
    this.formControl.setValue(enumValue.Name, { emitEvent: false });
    this.formControl.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: (formValue) => {
        this.#saveGameService.set(this.path(), editorName(formValue));
      },
    });
  }
}
