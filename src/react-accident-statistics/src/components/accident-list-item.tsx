import * as React from 'react';
import { AccidentStatistic } from 'src/models';


export interface AccidentDetailProps {
    accidentStatistic: AccidentStatistic
}

export default class AccidentListItem extends React.Component<AccidentDetailProps, any> {

  public render() {
    const {accidentStatistic} = this.props;
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
          <em>{accidentStatistic.vehicles?accidentStatistic.vehicles.length:0}</em>
          <span className={!accidentStatistic.vehicles || accidentStatistic.vehicles.length === 1 ? 'hidden' : ''}> vehicles of types </span>
          <span className={!accidentStatistic.vehicles || accidentStatistic.vehicles.length !== 1 ? 'hidden' : ''}> vehicle of type </span>
          <span>{accidentStatistic.vehicles?accidentStatistic.vehicles.map(vehicle => vehicle.type).join(', ') : ''}</span>
          {/* TODO: Vehicles and Casualties */}
          {/* TODO: Test all of the above */}
      </li>   
    );
  }
}
