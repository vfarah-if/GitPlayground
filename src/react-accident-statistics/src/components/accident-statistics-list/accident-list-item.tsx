import * as React from 'react';
import { AccidentStatistic } from './../../models';
import CasualtyDetailList from './casualty-detail-list';
import { DateTime } from '../shared/date-time';

export interface AccidentDetailProps {
  accidentStatistic: AccidentStatistic;
  showJson: boolean;
}

export default function AccidentListItem(props: AccidentDetailProps) {
  const { accidentStatistic, showJson } = props;
  return (
    <li>
      <mark>Accident Id: {accidentStatistic.id}</mark>
      <span> on </span><b><DateTime date={accidentStatistic.date}/></b>
      <span> at location </span><em>{accidentStatistic.location}</em>
      <span> in the borough of </span>
      <em>{accidentStatistic.borough}</em>
      <span>, with </span>
      <em>{accidentStatistic.casualties ? accidentStatistic.casualties.length : 0}</em>
      <span className={!accidentStatistic.casualties || accidentStatistic.casualties.length === 1 ? 'casualties hidden' : ''}> casualties</span>
      <span className={!accidentStatistic.casualties || accidentStatistic.casualties.length !== 1 ? 'casualty hidden' : ''}> casualty</span>
      <span> and </span>
      <em>{accidentStatistic.vehicles ? accidentStatistic.vehicles.length : 0}</em>
      <span className={!accidentStatistic.vehicles || accidentStatistic.vehicles.length === 1 ? 'vehicles hidden' : ''}> vehicles of types </span>
      <span className={!accidentStatistic.vehicles || accidentStatistic.vehicles.length !== 1 ? 'vehicle hidden' : ''}> vehicle of type </span>
      <em>{accidentStatistic.vehicles ? accidentStatistic.vehicles.map(vehicle => vehicle.type).join(', ') : ''}</em>
      <CasualtyDetailList casualties={accidentStatistic.casualties} />
      <pre className={showJson ? '' : 'hidden'}>{JSON.stringify(accidentStatistic, undefined, 2)}</pre>
    </li>
  );
}
