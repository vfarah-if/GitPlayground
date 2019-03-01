import { Casualty } from './casualty';
import { Vehicle } from './vehicle';

export interface AccidentStatistic {
  id?: number;
  lat?: string;
  lon?: string;
  location?: string;
  date?: string;
  severity?: (0 | 1 | 2) | string;
  borough?: string;
  casualties?: Array<Casualty>;
  vehicles?: Array<Vehicle>;
}
