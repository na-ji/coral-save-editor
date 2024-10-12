import { Component, input, numberAttribute } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'ci-ui-money',
  standalone: true,
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss'],
  imports: [DecimalPipe],
})
export class MoneyComponent {
  amount = input.required({ transform: numberAttribute });
}
