import * as React from 'react';

import { AxiosResponse } from 'axios';

import { SeverityOptions, SortByOptions, PagedAccidentStatistic, AccidentStatistic } from './../../models';
import { DEFAULT_FROM_DATE, MAXIMUM_YEAR } from './../constants';
import { AccidentStatisticsService } from './../../services';
import AccidentTitle from '../shared/accident-title';
import AccidentOrderedList from './accident-ordered-list';

export interface AccidentStatisticsListProps {
    fromDate?: string;
    toDate?: string;
    severityOption?: SeverityOptions;
    orderByOption?: SortByOptions;
    pageSize?: number;
    showJson?: boolean;
}

export interface AccidentStatisticsListState {
    from?: Date;
    to?: Date;
    severityOption: SeverityOptions;
    orderByOption: SortByOptions;
    pageSize: number;
    showJson: boolean;
    pagedAccidentStatistic?: PagedAccidentStatistic;
    accidentStatistics: Array<AccidentStatistic>;
}

export default class AccidentStatisticsList extends React.Component<AccidentStatisticsListProps, AccidentStatisticsListState> {
    service: AccidentStatisticsService = new AccidentStatisticsService();
    
    constructor(props: AccidentStatisticsListProps) {
        super(props);
        this.state = {
            from: props.fromDate ? new Date(props.fromDate) : DEFAULT_FROM_DATE,
            to: props.toDate ? new Date(props.toDate) : new Date(`${MAXIMUM_YEAR}-12-31T12:00:00`),
            severityOption: props.severityOption || 'Fatal',
            orderByOption: props.orderByOption || 'DateDescending',
            pageSize: props.pageSize || 500,
            showJson: props.showJson || false,
            pagedAccidentStatistic: undefined,
            accidentStatistics: []
        }
    }

    async componentDidMount() {
        await this.loadAccidentData();
    }

    async loadAccidentData(): Promise<void> {
        const { from, to, severityOption, orderByOption, pageSize } = this.state;
        let currentPage = 1;
        let pagedResponse = await this.service.get({
            from: from,
            to: to,
            severity: severityOption,
            sortBy: orderByOption,
            page: currentPage, pageSize: pageSize
        });
        this.updateState(pagedResponse);

        if (pagedResponse && pagedResponse.data && pagedResponse.data.nextPage) {
            while (pagedResponse.data.nextPage) {
                pagedResponse = await this.service.get({
                    from: from,
                    to: to,
                    severity: severityOption,
                    sortBy: orderByOption,
                    page: pagedResponse.data.nextPage,
                    pageSize: pageSize
                });
                this.updateState(pagedResponse);
            }
        }
    }

    public render() {
        const { pagedAccidentStatistic, severityOption, from, to, accidentStatistics, orderByOption, showJson } = this.state;
        return (
            <section className="accident-statistics-list">
                <AccidentTitle from={from} to={to} total={pagedAccidentStatistic?pagedAccidentStatistic.total:0} severityOption={severityOption} orderByOption={orderByOption} />
                <AccidentOrderedList accidentStatistics={accidentStatistics} showJson={showJson} />
            </section>
        );
    }

    private updateState(pagedResponse: AxiosResponse<PagedAccidentStatistic>) {
        this.setState((prevState) => {
            if (prevState && prevState.accidentStatistics && pagedResponse.data && pagedResponse.data.data) {
                const previousAccidents = prevState.accidentStatistics;
                const data = pagedResponse.data.data;
                if (previousAccidents && data) {
                    return Object.assign(prevState, {
                        accidentStatistics: previousAccidents.concat(data),
                        pagedAccidentStatistic: pagedResponse.data,
                    });
                }
            }
            return prevState;
        });
    }
}
