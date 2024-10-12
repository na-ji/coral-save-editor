import { Component, input } from '@angular/core';
import { PrimitiveFormPartComponent } from '../../../form-parts/primitive-form-part/primitive-form-part.component';

@Component({
  selector: 'app-player-info',
  standalone: true,
  imports: [PrimitiveFormPartComponent],
  templateUrl: './player-info.component.html',
  styleUrl: './player-info.component.scss',
})
export class PlayerInfoComponent {
  playerPath = input.required<string>();
}
