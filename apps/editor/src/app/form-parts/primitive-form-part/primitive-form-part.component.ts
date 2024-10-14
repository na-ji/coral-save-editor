import { Component, computed, DestroyRef, inject, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SaveGameService } from '../../core/save-game/save-game.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-primitive-form-part',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatLabel],
  templateUrl: './primitive-form-part.component.html',
})
export class PrimitiveFormPartComponent implements OnInit {
  path = input.required<string>();
  label = input.required<string>();
  protected formControl = new FormControl();
  protected formType = computed(() => {
    let type = 'text';

    const key = this.path().split('.').pop()!;

    switch (key) {
      case 'Int':
        type = 'int';
        break;
      case 'Bool':
        type = 'checkbox';
        break;
    }

    return type;
  });
  #destroyRef = inject(DestroyRef);
  #saveGameService = inject(SaveGameService);

  ngOnInit(): void {
    this.formControl.setValue(this.#saveGameService.get(this.path())(), { emitEvent: false });
    this.formControl.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: (formValue) => {
        this.#saveGameService.set(this.path(), formValue);
      },
    });
  }
}
