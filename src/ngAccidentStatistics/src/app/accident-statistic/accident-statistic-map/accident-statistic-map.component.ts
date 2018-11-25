
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { expand, map, reduce } from 'rxjs/internal/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { EMPTY } from 'rxjs/internal/observable/EMPTY';

import { Map, MapOptions, Control, tileLayer, latLng, marker, icon } from 'leaflet';

import { AccidentStatiticsService } from './../../api';
import { AccidentStatistic, PagedAccidentStatistic, SeverityOptions } from './../../model';

import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';

export type ImageOptions = 'Heatmap' | 'Macarbe' | 'Friendly';

@Component({
  selector: 'app-accident-statistic-map',
  templateUrl: './accident-statistic-map.component.html',
  styleUrls: ['./accident-statistic-map.component.scss']
})
export class AccidentStatisticMapComponent implements OnInit, OnDestroy {
  @Input() fromDate: string;
  @Input() toDate: string;
  @Input() severityOption: SeverityOptions;
  @Input() imageOption: ImageOptions;
  @Input() pageSize = 500;
  @Input() zoom = 9;

  @Input() latitude = 51.50608021;
  @Input() longitude = -0.12184322;
  @Input() maxZoom = 18;
  @Input() useGeolocationPosition = false;

  public from: Date;
  public to: Date;
  public leafletOptions: MapOptions = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: this.maxZoom })
    ],
    zoom: this.zoom,
    center: latLng(this.latitude, this.longitude)
  };

  public layersControl = {
    // baseLayers: {
    //   'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
    //    , 'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
    // }
    // , overlays: {
    //   'Big Circle': circle([46.95, -122], { radius: 5000 }),
    //   'Big Square': polygon([[46.8, -121.55], [46.9, -121.55], [46.9, -121.7], [46.8, -121.7]]),
    //   'Marker': marker([46.879966, -121.726909]),
    // }
  };

  public accidentStatisticsFirstPage$: Observable<PagedAccidentStatistic>;
  private accidentStatics$: Observable<Array<AccidentStatistic>>;
  private subscription: Subscription;
  // TODO: Figure out why typescript can not understand this function
  // private mapIcon: icon;
  private mapIcon: any;

  constructor(private accidentStatisticService: AccidentStatiticsService) { }

  ngOnInit() {
    if (this.fromDate) {
      this.from = new Date(this.fromDate);
    } else {
      this.from = new Date(2010, 1, 1);
    }

    if (this.toDate) {
      this.to = new Date(this.toDate);
    } else {
      const now = new Date();
      const previousYear = now.getUTCFullYear() - 1;
      this.to = new Date(`${previousYear}-12-31T12:00:00`);
    }

    if (!this.imageOption) {
      this.imageOption = 'Macarbe';
    }

    if (!this.severityOption) {
      this.severityOption = 'Fatal';
    }

    if (this.useGeolocationPosition) {
      window.navigator.geolocation.getCurrentPosition((position) => {
        console.log('Attaining position from geolocation api', position);
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.setLeafletOptions();
      });
    }

    this.setMapIcon();
    this.setLeafletOptions();

    this.accidentStatisticsFirstPage$ = this.accidentStatisticService.get({
      pageSize: this.pageSize,
      from: this.from,
      to: this.to,
      severity: this.severityOption
    });

    this.accidentStatics$ = this.accidentStatisticsFirstPage$.pipe(
        expand(({ nextPage }) => {
          return nextPage
            ? this.accidentStatisticService.get({
              pageSize: this.pageSize,
              from: this.from,
              to: this.to,
              severity: this.severityOption,
              page: nextPage })
            : EMPTY;
        }),
        map(({ data }) => data),
        reduce((acc, data) => acc.concat(data), [])
      );
  }

  setLeafletOptions() {
    this.leafletOptions = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: this.maxZoom })
      ],
      zoom: this.zoom,
      center: latLng(this.latitude, this.longitude)
    };
  }

  setMapIcon() {
    switch (this.imageOption) {
      case 'Heatmap':
        this.mapIcon = null;
        break;
      case 'Friendly':
        this.mapIcon = icon({
          iconSize: [25, 25],
          iconAnchor: [13, 25],
          iconUrl: 'https://image.flaticon.com/icons/svg/130/130163.svg'
        });
        break;
      default:
        this.mapIcon = icon({
          iconSize: [25, 25],
          iconAnchor: [13, 25],
          iconUrl: 'https://static.thenounproject.com/png/14312-200.png'
        });
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onMapReady(leafMap: Map) {
    this.subscription = this.accidentStatics$.subscribe(data => {
      data.forEach(item => {
        const popupContent: string = this.createPopupContent(item);
        if (this.mapIcon) {
          marker([Number(item.lat), Number(item.lon)], { icon: this.mapIcon })
          .bindPopup(popupContent)
          .addTo(leafMap);
        } else {
          marker([Number(item.lat), Number(item.lon)])
          .bindPopup(popupContent)
          .addTo(leafMap);
        }
      });
    });
  }

  createPopupContent(accidentStatistic: AccidentStatistic): string {
    const dateOfAccident = new Date(accidentStatistic.date);
    // tslint:disable-next-line:max-line-length
    return `<mark>${this.severityOption} Incident ${accidentStatistic.id}</mark>, occured on <em>${dateOfAccident.toDateString()} ${dateOfAccident.toTimeString()}</em>, involving ${accidentStatistic.casualties.length} person(s) and ${accidentStatistic.vehicles.length} vehicle(s) in the borough of ${accidentStatistic.borough}.`;
  }
}
