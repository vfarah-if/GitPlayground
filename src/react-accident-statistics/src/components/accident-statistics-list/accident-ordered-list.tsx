import * as React from 'react';
import { AccidentStatistic } from 'src/models';
import AccidentListItem from './accident-list-item';

export interface AccidentListProps {
    accidentStatistics: Array<AccidentStatistic>
}

export default function AccidentOrderedList(props: AccidentListProps) {
    let { accidentStatistics } = props;
    accidentStatistics = accidentStatistics || new Array<AccidentStatistic>();
    return (
        <ol>
            {accidentStatistics.map((accidentStatistic: AccidentStatistic) =>
                <AccidentListItem accidentStatistic={accidentStatistic} />
            )}
        </ol>
    );
}
