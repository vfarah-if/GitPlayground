import * as React from 'react';
import { AccidentStatistic } from './../../models';
import AccidentListItem from './accident-list-item';

export interface AccidentListProps {
    accidentStatistics: Array<AccidentStatistic>;
    showJson: boolean;
}

export default function AccidentOrderedList(props: AccidentListProps) {
    let { accidentStatistics, showJson } = props;
    accidentStatistics = accidentStatistics || new Array<AccidentStatistic>();
    return (
        <ol>
            {accidentStatistics.map((accidentStatistic: AccidentStatistic, i) =>
                <AccidentListItem accidentStatistic={accidentStatistic} showJson={showJson} key={i}/>
            )}
        </ol>
    );
}
