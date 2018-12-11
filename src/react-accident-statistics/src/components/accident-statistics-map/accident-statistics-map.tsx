import * as React from 'react';

import { AxiosResponse } from 'axios';

import { DEFAULT_FROM_DATE } from '../constants';
import { SeverityOptions, SortByOptions, PagedAccidentStatistic, AccidentStatistic } from './../../models';
import AccidentTitle from '../shared/accident-title';
import { AccidentStatisticsService } from './../../services';

export type ImageOptions = 'Marker' | 'Macarbe' | 'Friendly';

export interface AccidentStatisticsMapProps {
    fromDate?: string;
    toDate?: string;
    severityOption?: SeverityOptions;
    orderByOption?: SortByOptions;
    pageSize?: number;
    imageOption?:  ImageOptions;
    zoom?: number;
}

export interface AccidentStatisticsMapState {
    from?: Date;
    to?: Date;
    severityOption: SeverityOptions;
    orderByOption: SortByOptions;
    pageSize: number;
    imageOption:  ImageOptions;
    zoom: number;
    pagedAccidentStatistic?: PagedAccidentStatistic;
    accidentStatistics: Array<AccidentStatistic>;
}

export default class AccidentStatisticsMap extends React.Component<AccidentStatisticsMapProps, AccidentStatisticsMapState> {
    service: AccidentStatisticsService = new AccidentStatisticsService();

    constructor(props: AccidentStatisticsMapProps) {
        super(props);
        const now = new Date();
        const previousYear = now.getUTCFullYear() - 1;
        this.state = {
            from: props.fromDate ? new Date(props.fromDate) : DEFAULT_FROM_DATE,
            to: props.toDate ? new Date(props.toDate) : new Date(`${previousYear}-12-31T12:00:00`),
            severityOption: props.severityOption || 'Fatal',
            orderByOption: props.orderByOption || 'DateDescending',
            pageSize: props.pageSize || 500,
            pagedAccidentStatistic: undefined,
            accidentStatistics: [],
            imageOption: props.imageOption || 'Macarbe',
            zoom: props.zoom || 9,
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
        const { pagedAccidentStatistic, severityOption, from, to, orderByOption} = this.state;

        return (
            <section>
                <AccidentTitle from={from} to={to} total={pagedAccidentStatistic?pagedAccidentStatistic.total:0} severityOption={severityOption} orderByOption={orderByOption} />
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
