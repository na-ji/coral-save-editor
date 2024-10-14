import { Component } from '@angular/core';
import { DateFormComponent } from '../forms/date-form/date-form.component';
import { CardComponent } from '@coral-island/ui';
import { EnumFormComponent } from '../forms/enum-form/enum-form.component';

@Component({
  selector: 'app-world',
  standalone: true,
  imports: [DateFormComponent, CardComponent, EnumFormComponent],
  templateUrl: './world.component.html',
  styleUrl: './world.component.scss',
})
export class WorldComponent {}
