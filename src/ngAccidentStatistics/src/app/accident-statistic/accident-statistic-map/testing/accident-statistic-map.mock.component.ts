
import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';

import { MapOptions, tileLayer, latLng } from 'leaflet';

import { PagedAccidentStatistic, SeverityOptions } from './../../../model';

import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';

@Component({
  selector: 'app-accident-statistic-map',
  template: '<p>Mock accident Statistic Map Component</p>'
})
export class AccidentStatisticMapMockComponent {
  @Input() fromDate: string;
  @Input() toDate: string;
  @Input() severityOption: SeverityOptions = 'Fatal';
  @Input() imageType: 'heatmap' | 'macarbe' | 'friendly';
  @Input() pageSize = 500;
  @Input() zoom = 9;
  @Input() latitude = 51.5074;
  @Input() longitude = 0.1278;
  @Input() maxZoom = 18;

  public from: Date;
  public to: Date;
  public leafletOptions: MapOptions = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: this.maxZoom })
    ],
    zoom: this.zoom,
    center: latLng(this.latitude, this.longitude)
  };

  public layersControl = {};

  public accidentStatisticsFirstPage$: Observable<PagedAccidentStatistic>;
}
