import * as React from 'react';

import { AxiosResponse } from 'axios';
import { Map, TileLayer, ZoomControl } from 'react-leaflet';
import { LatLng } from 'leaflet';

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
    imageOption?: ImageOptions;
    zoom?: number;
    latitude?: number;
    longitude?: number;
    maxZoom?: number;
    useGeolocationPosition?: boolean;
}

export interface AccidentStatisticsMapState {
    from?: Date;
    to?: Date;
    severityOption: SeverityOptions;
    orderByOption: SortByOptions;
    pageSize: number;
    imageOption: ImageOptions;
    zoom: number;
    pagedAccidentStatistic?: PagedAccidentStatistic;
    accidentStatistics: Array<AccidentStatistic>;
    latitude: number;
    longitude: number;
    maxZoom: number;
    useGeolocationPosition: boolean;
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
            latitude: props.latitude || 51.50608021,
            longitude: props.longitude || -0.12184322,
            maxZoom: props.maxZoom || 18,
            useGeolocationPosition: props.useGeolocationPosition || false,
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
        const { pagedAccidentStatistic, severityOption, from, to, orderByOption, longitude, latitude, zoom } = this.state;
        const position = new LatLng(latitude, longitude);

        return (
            <section className="map">
                <AccidentTitle from={from} to={to} total={pagedAccidentStatistic ? pagedAccidentStatistic.total : 0} severityOption={severityOption} orderByOption={orderByOption} />
                <Map center={position} zoom={zoom}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ZoomControl position="topright" />
                </Map>
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
