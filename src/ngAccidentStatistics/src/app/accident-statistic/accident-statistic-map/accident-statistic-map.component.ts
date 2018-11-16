
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { expand, map, reduce } from 'rxjs/internal/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { EMPTY } from 'rxjs/internal/observable/EMPTY';

import { tileLayer, latLng, circle, polygon, marker, Map, MapOptions, Control, icon } from 'leaflet';

import { AccidentStatiticsService } from './../../api';
import { AccidentStatistic, PagedAccidentStatistic, SeverityOptions } from './../../model';

import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';

@Component({
  selector: 'app-accident-statistic-map',
  templateUrl: './accident-statistic-map.component.html',
  styleUrls: ['./accident-statistic-map.component.scss']
})
export class AccidentStatisticMapComponent implements OnInit, OnDestroy {
  @Input() fromDate: string;
  @Input() severityOption: SeverityOptions;
  @Input() imageType: 'heatmap' | 'macarbe' | 'friendly';

  from: Date;
  leafletOptions: MapOptions = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
    ],
    zoom: 10,
    center: latLng(51.5074, 0.1278)
  };

  layersControl = {
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
  private mapIcon: icon;

  constructor(private accidentStatisticService: AccidentStatiticsService) { }

  ngOnInit() {
    if (this.fromDate) {
      this.from = new Date(this.fromDate);
    } else {
      this.from = new Date(2010, 1, 1);
    }

    if (!this.imageType) {
      this.imageType = 'macarbe';
    }

    if (!this.severityOption) {
      this.severityOption = 'Fatal';
    }

    this.setMapIcon();

    this.accidentStatisticsFirstPage$ = this.accidentStatisticService.get({ pageSize: 500, from: this.from, severity: this.severityOption });

    this.accidentStatics$ = this.accidentStatisticsFirstPage$.pipe(
        expand(({ nextPage }) => {
          return nextPage
            ? this.accidentStatisticService.get({ pageSize: 500, from: this.from, severity: this.severityOption, page: nextPage })
            : EMPTY;
        }),
        map(({ data }) => data),
        reduce((acc, data) => acc.concat(data), [])
      );
  }

  setMapIcon() {
    switch (this.imageType) {
      case 'heatmap':
        this.mapIcon = null;
        break;
      case 'friendly':
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
          if (this.mapIcon) {
            marker([Number(item.lat), Number(item.lon)], { icon: this.mapIcon }).addTo(leafMap);
          } else {
            marker([Number(item.lat), Number(item.lon)]).addTo(leafMap);
          }
        }
      });
    });
  }
}
