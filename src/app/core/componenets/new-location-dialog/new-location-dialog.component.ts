import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Coordinates, LocationSet } from '@core/models';
import { AppCommonModule } from 'src/app/app.common.module';
import { MapViewerComponent } from "../map-viewer/map-viewer.component";

@Component({
  selector: 'app-new-location-dialog',
  imports: [AppCommonModule, MapViewerComponent],
  templateUrl: './new-location-dialog.component.html',
  styleUrl: './new-location-dialog.component.scss'
})
export class NewLocationDialogComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<NewLocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {longitude: number, latitude: number}
  ) {
    this.coordinates = {longitude: data.longitude, latitude: data.latitude};
  }

  locationName = '';
  radius = 0;
  coordinates?: Coordinates;
  pointerCoordinates?: Coordinates;

  onSaveClick() : void {
    if(this.coordinates) {
      const returnCoords = this.pointerCoordinates ?? this.coordinates;
      const returnValue: LocationSet = {addressName: this.locationName, coordinates: returnCoords, radius: this.radius, saved: true, description: ''};
      this.dialogRef.close(returnValue);
    }
  }

  onCoordinatesClick(coords: Coordinates) : void {
    this.pointerCoordinates = coords;
  }

  isSaveDisabled() : boolean {
    return this.locationName == '' || this.radius == 0;
  }

}
