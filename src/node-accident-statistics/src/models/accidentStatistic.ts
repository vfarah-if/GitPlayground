import { Casualty } from "./casualty";
import { Vehicle } from "./vehicle";

// tslint:disable-next-line:interface-name
export interface AccidentStatistic {
  id?: number;
  lat?: string;
  lon?: string;
  location?: string;
  date?: string;
  severity?: string;
  borough?: string;
  casualties?: Casualty[];
  vehicles?: Vehicle[];
}
