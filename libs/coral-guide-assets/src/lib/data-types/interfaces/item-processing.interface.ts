import { MinimalItem } from '../types/minimal-item.type';
import { TagBasedItem } from './tag-based-item.interface';
import { ItemProcessingRefinement } from './item-processing-refinement.interface';
import { Quality } from '../enums/quality.enum';
import { Time } from './time.interface';

export interface ItemProcessing {
  day: number;
  time: Time;
  genericInput: null | {
    key: string;
    amount: number;
    genericItem?: TagBasedItem;
  };
  output: { item: MinimalItem & { sellPrice?: number }; amount: number };
  input: { item: MinimalItem; amount: number };
  additionalInput: { item: MinimalItem; amount: number }[];
  useCategory: boolean;
  qualities?: Record<
    string | Quality,
    {
      day: number;
      time: {
        hours: number;
        minutes: number;
      };
    }
  >;
  machine?: string;
  refinements?: ItemProcessingRefinement[];
}
