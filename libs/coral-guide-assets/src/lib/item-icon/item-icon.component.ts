import { Component, input, numberAttribute, ViewEncapsulation } from '@angular/core';
import { Quality } from '../data-types/enums/quality.enum';
import { REPOSITORY_URL } from '../repository-url.const';
import { RarityIconComponent } from '../rarity-icon/rarity-icon.component';

@Component({
  selector: 'cga-item-icon',
  standalone: true,
  templateUrl: './item-icon.component.html',
  styleUrls: ['./item-icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RarityIconComponent],
  host: {
    "['class.cga-item-icon']": 'true',
  },
})
export class ItemIconComponent {
  itemName = input.required<string>();
  subIconName = input<string | null>();
  quality = input<Quality>();
  amount = input(0, { transform: numberAttribute });

  protected readonly REPOSITORY_URL = REPOSITORY_URL;

  setFallBack($event: ErrorEvent) {
    const target = $event.target as HTMLImageElement | null;
    if (target) target.src = this.REPOSITORY_URL + '/assets/ui/images/placeholder.png';
  }
}
