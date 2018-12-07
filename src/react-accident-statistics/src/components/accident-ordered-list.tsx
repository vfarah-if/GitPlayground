import * as React from 'react';
import { AccidentStatistic } from 'src/models';

export interface AccidentListProps {
    accidentStatistics: Array<AccidentStatistic>
}

export default class AccidentOrderedList extends React.Component<AccidentListProps, any> {
  
  public render() {
    let { accidentStatistics } = this.props;
    debugger;
    accidentStatistics = accidentStatistics || new Array<AccidentStatistic>();
    return (
        <ol>
            {accidentStatistics.map((accidentStatistic: AccidentStatistic) =>
             <li>
                 <span><mark>Accident Id: {accidentStatistic.id}</mark></span>
             </li>   
            )}
        </ol>
    );
}
}
