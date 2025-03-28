import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Coordinates, LocationSet } from '@core/models';
import { AppCommonModule } from 'src/app/app.common.module';

@Component({
  selector: 'app-new-location-dialog',
  imports: [AppCommonModule],
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

  onSaveClick() : void {
    if(this.coordinates) {
      const returnValue: LocationSet = {addressName: this.locationName, coordinates: this.coordinates, radius: this.radius, saved: true};
      this.dialogRef.close(returnValue);
    }
  }

  isSaveDisabled() : boolean {
    return this.locationName == '' || this.radius == 0;
  }

}
