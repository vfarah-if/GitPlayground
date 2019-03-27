
import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { MapOptions, tileLayer, latLng } from 'leaflet';

import { PagedAccidentStatistic, SeverityOptions } from './../../../model';

import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import { ImageOptions } from '../accident-statistic-map.component';

@Component({
  selector: 'app-accident-statistic-map',
  template: '<p>Mock accident Statistic Map Component</p>'
})
export class AccidentStatisticMapMockComponent {
  @Input() fromDate: string;
  @Input() toDate: string;
  @Input() severityOption: SeverityOptions = 'Fatal';
  @Input() imageType: ImageOptions;
  @Input() pageSize = 100;
  @Input() zoom = 9;
  @Input() latitude = 51.5074;
  @Input() longitude = 0.1278;
  @Input() maxZoom = 18;
  @Input() useGeolocationPosition = false;

  public from: Date;
  public to: Date;
  public leafletOptions: MapOptions = {};
  public layersControl = {};
  public accidentStatisticsFirstPage$: Observable<PagedAccidentStatistic>;
}
