import * as React from 'react';
import { AccidentStatistic } from 'src/models';
import CasualtyDetailList from './casualty-detail-list';

export interface AccidentDetailProps {
  accidentStatistic: AccidentStatistic;
  showJson: boolean;
}

export default function AccidentListItem(props: AccidentDetailProps) {
  const { accidentStatistic, showJson } = props;
  return (
    <li>
      <mark>Accident Id: {accidentStatistic.id}</mark>
      <span> on </span><b><time>{accidentStatistic.date ? `${new Date(accidentStatistic.date).toDateString()} ${new Date(accidentStatistic.date).toLocaleTimeString()}` : undefined}</time></b>
      <span> at location </span><em>{accidentStatistic.location}</em>
      <span> in the borough of </span>
      <em>{accidentStatistic.borough}</em>
      <span>, with</span>
      <em>{accidentStatistic.casualties ? accidentStatistic.casualties.length : 0}</em>
      <span className={!accidentStatistic.casualties || accidentStatistic.casualties.length === 1 ? 'hidden' : ''}> casualties</span>
      <span className={!accidentStatistic.casualties || accidentStatistic.casualties.length !== 1 ? 'hidden' : ''}> casualty</span>
      <span> and </span>
      <em>{accidentStatistic.vehicles ? accidentStatistic.vehicles.length : 0}</em>
      <span className={!accidentStatistic.vehicles || accidentStatistic.vehicles.length === 1 ? 'hidden' : ''}> vehicles of types </span>
      <span className={!accidentStatistic.vehicles || accidentStatistic.vehicles.length !== 1 ? 'hidden' : ''}> vehicle of type </span>
      <em>{accidentStatistic.vehicles ? accidentStatistic.vehicles.map(vehicle => vehicle.type).join(', ') : ''}</em>
      <CasualtyDetailList casualties={accidentStatistic.casualties} />
      <pre className={showJson ? '' : 'hidden'}>{JSON.stringify(accidentStatistic, undefined, 2)}</pre>
    </li>
  );
}
