import * as React from 'react';
import { SeverityOptions, SortByOptions } from '../../models';
import { DateTime } from './date-time';

export interface AccidentTitleProps {
    from?: Date|string|number;
    to?: Date|string|number;
    severityOption?: SeverityOptions;
    orderByOption?: SortByOptions;
    pageSize?: number;
    total?: number;
    prefixMessage?: string;
}

export default function AccidentTitle(props: AccidentTitleProps) {
    const { total, severityOption, from, to, orderByOption, prefixMessage } = props;
    return (
        <h1>
            <span>{prefixMessage ? prefixMessage : 'Loading'} </span><em>{total ? total : 0}</em>
            <em> {severityOption ? severityOption.toLowerCase() : 'undefined'}</em>
            <span> accidents list from </span>
            <DateTime date={from}/>
            <span> to </span>
            <DateTime date={to}/>
            <span>, ordered by </span>
            <em>{orderByOption ? orderByOption.toLowerCase() : 'datedescending'}</em>
        </h1>
    );
}
