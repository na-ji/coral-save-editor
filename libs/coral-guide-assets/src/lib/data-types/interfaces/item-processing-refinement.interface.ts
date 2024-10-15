import { Time } from './time.interface';
import { Quality } from '../enums/quality.enum';

export interface ItemProcessingRefinement {
  from: Quality;
  to: Quality;
  day: number;
  time: Time;
}
