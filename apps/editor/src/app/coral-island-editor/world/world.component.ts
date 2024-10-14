import { Component } from '@angular/core';
import { DateFormComponent } from '../forms/date-form/date-form.component';
import { CardComponent } from '@coral-island/ui';

@Component({
  selector: 'app-world',
  standalone: true,
  imports: [DateFormComponent, CardComponent],
  templateUrl: './world.component.html',
  styleUrl: './world.component.scss',
})
export class WorldComponent {}
