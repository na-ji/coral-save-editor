import { Component } from '@angular/core';
import { DateFormComponent } from '../forms/date-form/date-form.component';

@Component({
  selector: 'app-world',
  standalone: true,
  imports: [DateFormComponent],
  templateUrl: './world.component.html',
  styleUrl: './world.component.scss',
})
export class WorldComponent {}
