import { Season } from '../types/season.type';
import { Weather } from '../types/weather.type';
import { Fish } from '../interfaces/fish.interface';

export type FishDashboardEntry = {
  id: string;
  iconName: string | null;
  seasons: Season[];
  weathers: Weather[];
  dateRanges: Fish['spawnSettings'][0]['dateRangeList'];
};
