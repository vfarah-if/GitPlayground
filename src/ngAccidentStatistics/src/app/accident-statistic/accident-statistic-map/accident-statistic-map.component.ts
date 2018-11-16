import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { expand, map, reduce } from 'rxjs/internal/operators';
import { Subscription } from 'rxjs/internal/Subscription';

import { tileLayer, latLng, circle, polygon, marker, Map, MapOptions, Control, icon } from 'leaflet';

import { AccidentStatiticsService } from './../../api';
import { AccidentStatistic, PagedAccidentStatistic } from './../../model';

import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';

@Component({
  selector: 'app-accident-statistic-map',
  templateUrl: './accident-statistic-map.component.html',
  styleUrls: ['./accident-statistic-map.component.scss']
})
export class AccidentStatisticMapComponent implements OnInit, OnDestroy {
  @Input() fromDate: Date;

  leafletOptions: MapOptions = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
    ],
    zoom: 10,
    center: latLng(51.5074, 0.1278)
  };

  layersControl = {
    baseLayers: {
      'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
      //  , 'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
    }
    // , overlays: {
    //   'Big Circle': circle([46.95, -122], { radius: 5000 }),
    //   'Big Square': polygon([[46.8, -121.55], [46.9, -121.55], [46.9, -121.7], [46.8, -121.7]]),
    //   'Marker': marker([46.879966, -121.726909]),
    // }
  };

  accidentStatics$: Observable<Array<AccidentStatistic>>;
  accidentStatisticsFirstPage$: Observable<PagedAccidentStatistic>;
  private subscription: Subscription;

  constructor(private accidentStatisticService: AccidentStatiticsService) { }

  ngOnInit() {
    if (!this.fromDate) {
      this.fromDate = new Date(2010, 1, 1);
    }
    this.accidentStatisticsFirstPage$ = this.accidentStatisticService.get({ pageSize: 500, from: this.fromDate });

    this.accidentStatics$ = this.accidentStatisticsFirstPage$
      .pipe(
        expand(({ nextPage }) => {
          return nextPage ? this.accidentStatisticService.get({ pageSize: 500, from: this.fromDate, page: nextPage }) : EMPTY;
        }),
        map(({ data }) => data),
        reduce((acc, data) => acc.concat(data), [])
      );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onMapReady(leafMap: Map) {
    console.log('Start mapping away with the service ...');
    this.subscription = this.accidentStatics$.subscribe(data => {
      data.forEach(item => {
        marker([Number(item.lat), Number(item.lon)]
          // Comment this out to see the default map
          , {
            icon: icon({
              iconSize: [25, 41],
              iconAnchor: [13, 41],
              iconUrl: 'https://static.thenounproject.com/png/14312-200.png',
            })
          }
        ).addTo(leafMap);
      });
    });
  }
}
