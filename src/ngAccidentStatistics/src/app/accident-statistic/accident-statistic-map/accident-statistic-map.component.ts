import { Component, OnInit } from '@angular/core';
import { tileLayer, latLng, circle, polygon, marker, Map, MapOptions, Control } from 'leaflet';

@Component({
  selector: 'app-accident-statistic-map',
  templateUrl: './accident-statistic-map.component.html',
  styleUrls: ['./accident-statistic-map.component.scss']
})
export class AccidentStatisticMapComponent implements OnInit {

  leafletOptions: MapOptions = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
    ],
    zoom: 10,
    center: latLng(51.5074, 0.1278)
  };

  layersControl = {
    baseLayers: {
      'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }),
      'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
    },
    overlays: {
      'Big Circle': circle([46.95, -122], { radius: 5000 }),
      'Big Square': polygon([[46.8, -121.55], [46.9, -121.55], [46.9, -121.7], [46.8, -121.7]]),
      'Marker': marker([46.879966, -121.726909]),
    }
  };

  constructor() { }

  ngOnInit() {

  }

  onMapReady(map: Map) {
    console.log('Start mapping away with the service ...');
  }
}
