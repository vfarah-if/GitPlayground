import * as React from 'react';

import { AxiosResponse } from 'axios';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLng, Icon } from 'leaflet';

import { DEFAULT_FROM_DATE } from '../constants';
import { SeverityOptions, SortByOptions, PagedAccidentStatistic, AccidentStatistic } from './../../models';
import AccidentTitle from '../shared/accident-title';
import { AccidentStatisticsService } from './../../services';
import { DateTime } from '../shared/date-time';

export type ImageOptions = 'Marker' | 'Macarbe' | 'Friendly';

type MarkerProps = {
    content: JSX.Element,
    position: LatLng,
    icon: Icon,
};

type MarkerData = {
    key: string, 
    content: JSX.Element,
    position: LatLng,
    icon: Icon 
};

const CustomPopupMarker = ({ content, position, icon }: MarkerProps) => (
    <Marker position={position} icon={icon}>                        
        <Popup>{content}</Popup>
    </Marker>
);

const CustomMarkers = ({ markers }: { markers: Array<MarkerData> }) => {
    const items = markers.map(({ key, ...props }) => (
        <CustomPopupMarker key={key} {...props} />
    ))
    return <React.Fragment>{items}</React.Fragment>
};

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
    markers: Array<MarkerData>,
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
            markers: [],
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
        const { pagedAccidentStatistic, severityOption, from, to, orderByOption, longitude, latitude, zoom, markers } = this.state;
        const position = new LatLng(latitude, longitude);

        return (
            <section className="map">
                <AccidentTitle from={from} to={to} total={pagedAccidentStatistic ? pagedAccidentStatistic.total : 0} severityOption={severityOption} orderByOption={orderByOption} />
                <Map center={position} zoom={zoom}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <CustomMarkers markers={markers} />
                </Map>
            </section>
        );
    }

    private updateState(pagedResponse: AxiosResponse<PagedAccidentStatistic>) {
        this.setState((prevState) => {
            if (prevState && prevState.markers && pagedResponse.data && pagedResponse.data.data) {
                const previousMarkers = prevState.markers;
                const data = this.getMarkers(pagedResponse.data.data);
                if (data) {
                    return Object.assign(prevState, {
                        markers: previousMarkers.concat(data),
                        pagedAccidentStatistic: pagedResponse.data,
                    });
                }
            }
            return prevState;
        });
    }

    private getMarkers(data: AccidentStatistic[] | undefined): Array<MarkerData> {
        const result = new Array<MarkerData>();
        const icon: Icon = this.getIcon();
        if (data) {
            data.forEach((item, index) => {
                const popupContent = this.createPopupContent(item);
                const key = item.id ? item.id.toString() : index.toString();
                const markerData: MarkerData = {
                    key: key,
                    position: new LatLng(Number(item.lat), Number(item.lon)),
                    content: popupContent,
                    icon: icon
                };
                result.push(markerData);
            })
        }
        return result;
    }
   
    private getIcon(): Icon {        
        switch(this.state.imageOption){
            case'Marker': return new Icon({
                iconSize: [25, 41],
                iconAnchor: [13, 40],
                iconUrl: 'https://unpkg.com/leaflet@1.3.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.3.4/dist/images/marker-shadow.png'
              });  
            case'Friendly': return new Icon({
                iconSize: [40, 40],
                iconAnchor: [13, 40],
                iconUrl: 'https://image.flaticon.com/icons/svg/130/130163.svg',
              });  
            default : return new Icon({
                iconSize: [35, 35],
                iconAnchor: [13, 35],
                iconUrl: 'https://static.thenounproject.com/png/14312-200.png',
              });  
        }
    }

    private createPopupContent(accidentStatistic: AccidentStatistic): JSX.Element {
        const dateOfAccident = accidentStatistic.date ? new Date(accidentStatistic.date) : new Date();
        const casualtyCount = accidentStatistic && accidentStatistic.casualties ? accidentStatistic.casualties.length : 0;
        const vehicleCount = accidentStatistic && accidentStatistic.vehicles ? accidentStatistic.vehicles.length : 0;
        return (
        <span>
            <mark>{this.state.severityOption} Incident {accidentStatistic.id}</mark>
            <span>, occured on <DateTime date={dateOfAccident}/></span>
            <span>, involving {casualtyCount} {this.pluralOrSingleForm(accidentStatistic.casualties, 'casualties', 'casualty')}</span>
            <span> and {vehicleCount} {this.pluralOrSingleForm(accidentStatistic.vehicles, 'vehicles', 'vehicle')}</span>
            <span> in the borough of {accidentStatistic.borough}.</span>
        </span>);
    }

    private pluralOrSingleForm(array: Array<any> | undefined, plural: string, single: string): string {
        if (array && array.length === 1) {
            return single;
        }
        return plural;
    }
}
