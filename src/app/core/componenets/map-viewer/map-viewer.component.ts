import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Coordinates } from '@core/models';
import {AngularOpenlayersModule, MapComponent} from "ng-openlayers";
import { transform } from 'ol/proj';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { marker } from './marker.image';

@Component({
  selector: 'app-map-viewer',
  imports: [AngularOpenlayersModule],
  templateUrl: './map-viewer.component.html',
  styleUrl: './map-viewer.component.scss'
})
export class MapViewerComponent implements AfterViewInit {

  private _coordinates?: Coordinates;
  @Input()
  get coordinates(): Coordinates | undefined {return this._coordinates}
  set coordinates(value: Coordinates | undefined) {
    this._coordinates = value;
    if(value) {
      this.pointerCoordinates = value;
    }
  }

  @Input() height = 500;
  @Input() width = 100;
  @Output() coordinatesClick: EventEmitter<Coordinates> = new EventEmitter<Coordinates>;
  @ViewChild('mapComponent') mapComponent!: MapComponent;

  pointerCoordinates?: Coordinates;
  markerImage = marker

  ngAfterViewInit() {
    setTimeout(() => {
          const map = this.mapComponent.instance; // Assuming you can access the OpenLayers Map instance
          map.on('singleclick', (event: any) => {
            this.onSingleClick(event);
          });
    }, 200);
  }
  
  onSingleClick(event: any) {
    const lonlat = transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')
    this.pointerCoordinates = {longitude: lonlat[0], latitude: lonlat[1]};
    this.coordinatesClick.emit(this.pointerCoordinates);
  }

  isPointerSet() : boolean {
    if(this.pointerCoordinates && this.pointerCoordinates.latitude && this.pointerCoordinates.longitude) {
      return true;
    }
    return false;
  }

  getHeight() : string {
    return this.height + 'px';
  }
  getWidth() : string {
    return this.width + 'px';
  }

}
