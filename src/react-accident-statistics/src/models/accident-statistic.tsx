import { Casualty } from './casualty';
import { Vehicle } from './vehicle';

export type SeverityOptionValues = 0 | 1 | 2 | string;

export interface AccidentStatistic {
  id?: number;
  lat?: string;
  lon?: string;
  location?: string;
  date?: string;
  severity?: SeverityOptionValues;
  borough?: string;
  casualties?: Array<Casualty>;
  vehicles?: Array<Vehicle>;
}
