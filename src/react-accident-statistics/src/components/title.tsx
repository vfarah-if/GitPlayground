import * as React from 'react';
import { SeverityOptions, SortByOptions, PagedAccidentStatistic } from 'src/models';

export interface TitleProps {
    from?: Date;
    to?: Date;
    severityOption?: SeverityOptions;
    orderByOption?: SortByOptions;
    pageSize?: number;
    pagedAccidentStatistic?: PagedAccidentStatistic;
}

export default class Title extends React.Component<TitleProps, any> {

    public render() {
        const { pagedAccidentStatistic, severityOption, from, to, orderByOption } = this.props;
        return (
            <h1>
                <span>Loading </span><em>{pagedAccidentStatistic ? pagedAccidentStatistic.total : 0}</em>
                <em> {severityOption ? severityOption.toLowerCase() : 'none'}</em>
                <span> accidents list from </span>
                <time>{from ? `${from.toDateString()} ${from.toLocaleTimeString()}` : undefined}</time>
                <span> to </span>
                <time>{to ? `${to.toDateString()} ${to.toLocaleTimeString()}` : undefined}</time>
                <span>, ordered by </span>
                <em>{orderByOption ? orderByOption.toLowerCase() : 'datedescending'}</em>
            </h1>
        );
    }
}
