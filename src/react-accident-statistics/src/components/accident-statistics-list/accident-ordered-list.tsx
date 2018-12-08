import * as React from 'react';
import { AccidentStatistic } from 'src/models';
import AccidentListItem from './accident-list-item';

export interface AccidentListProps {
    accidentStatistics: Array<AccidentStatistic>
}

export default class AccidentOrderedList extends React.Component<AccidentListProps, any> {

    public render() {
        let { accidentStatistics } = this.props;        
        accidentStatistics = accidentStatistics || new Array<AccidentStatistic>();
        return (
            <ol>
                {accidentStatistics.map((accidentStatistic: AccidentStatistic) =>
                    <AccidentListItem accidentStatistic={accidentStatistic} />
                )}
            </ol>
        );
    }
}
