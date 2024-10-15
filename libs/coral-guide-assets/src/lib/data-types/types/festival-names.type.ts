import { UiIcon } from '../enums/ui-icon.enum';

export const FestivalNames = [
  'cherry-blossom',
  'tree-planting',
  'animal',
  'beach-clean-up',
  'spooky',
  'harvest',
  'new-year-eve',
  'winter-fair',
] as const;

export type FestivalName = (typeof FestivalNames)[number];

export const FestivalDisplayNames = {
  'cherry-blossom': 'Cherry blossom',
  'earth-day': 'Earth Day',
  'tree-planting': 'Tree Planting',
  animal: 'Animal',
  'beach-clean-up': 'Beach Clean Up',
  spooky: 'Spooky',
  harvest: 'Harvest',
  'new-year-eve': 'New Year Eve Feast',
  'winter-fair': 'Winter Fair',
} as const;

type FestivalDisplayName = (typeof FestivalDisplayNames)[keyof typeof FestivalDisplayNames];

export const FestivalIcons = {
  'winter-fair': UiIcon.WINTER_FAIR,
  'tree-planting': UiIcon.EARTH,
  animal: UiIcon.ANIMAL_DAY,
  'beach-clean-up': UiIcon.OCEAN_CLEAN_UP,
  spooky: UiIcon.SPOOKY,
  harvest: UiIcon.MOONCAKE,
  'new-year-eve': UiIcon.NEW_YEAR,
  'cherry-blossom': UiIcon.CHERRY_BLOSSOM,
} as const;

export const FestivalEventIds = {
  'cherry-blossom': 'cherryBlossom',
  'tree-planting': 'treePlanting',
  animal: 'AnimalFestival',
  'beach-clean-up': 'beach-clean-up',
  spooky: 'spookyfestival',
  harvest: 'mooncakefestival',
  'new-year-eve': 'newyearfeast',
  'winter-fair': 'winterFair',
} as const;
