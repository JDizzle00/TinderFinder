import { Component } from '@angular/core';
import {AngularOpenlayersModule} from "ng-openlayers";

@Component({
  selector: 'app-map-viewer',
  imports: [AngularOpenlayersModule],
  templateUrl: './map-viewer.component.html',
  styleUrl: './map-viewer.component.scss'
})
export class MapViewerComponent {

}
