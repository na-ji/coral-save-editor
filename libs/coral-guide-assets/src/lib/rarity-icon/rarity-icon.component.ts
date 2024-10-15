import { Component, input } from '@angular/core';
import { REPOSITORY_URL } from '../repository-url.const';
import { Quality } from '../data-types/enums/quality.enum';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'cga-rarity-icon',
  standalone: true,
  templateUrl: './rarity-icon.component.html',
  styleUrls: ['./rarity-icon.component.scss'],
  imports: [TitleCasePipe],
})
export class RarityIconComponent {
  QUALITY = Quality;
  quality = input<Quality>();
  protected readonly REPOSITORY_URL = REPOSITORY_URL;

  setFallBack($event: ErrorEvent) {
    const target = $event.target as HTMLImageElement | null;
    if (target) target.src = this.REPOSITORY_URL + '/assets/ui/images/spacer.gif';
  }
}
