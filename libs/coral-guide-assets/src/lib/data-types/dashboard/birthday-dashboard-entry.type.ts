import { NPC } from '../interfaces/npc.interface';
import { GiftPreference } from '../types/gift-preference.type';

export type BirthdayDashboardEntry = {
  npcKey: NPC['key'];
  birthday: NonNullable<NPC['birthday']>;
  lovedGifts: GiftPreference[];
} & Pick<NPC, 'characterName' | 'iconName'>;
