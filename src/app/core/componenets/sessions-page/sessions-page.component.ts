import { Component, OnInit } from '@angular/core';
import { Coordinates, LocationSet, TriangulationSession } from '@core/models';
import { GeoLocationService } from '@core/services';
import { AppCommonModule } from 'src/app/app.common.module';
import { NewLocationDialogComponent } from '../new-location-dialog/new-location-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs';

@Component({
  selector: 'app-sessions-page',
  imports: [AppCommonModule],
  templateUrl: './sessions-page.component.html',
  styleUrl: './sessions-page.component.scss'
})
export class SessionsPageComponent implements OnInit {

  position?: GeolocationPosition;
  sessions: TriangulationSession[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly geoLocationService: GeoLocationService
  ) {}

  ngOnInit(): void {
    this.sessions = [{
      name: "Test Baddie",
      locationSets: []
    }]
    this.testTriangulation()
  }

  testTriangulation() : void {
    const jannis: LocationSet = {coordinates: {latitude: 48.18786894380662, longitude: 11.503847044646422}, radius: 20, addressName: "Test", saved: true};
    const david: LocationSet = {coordinates: {latitude: 48.155519934026515, longitude: 11.536818686203635}, radius: 20, addressName: "Test", saved: true};
    const jakob: LocationSet = {coordinates: {latitude: 48.13016493283865, longitude: 11.511707881498408}, radius: 20, addressName: "Test", saved: true};
    console.log(this.geoLocationService.getCoordinatesFromTriangulation([jannis, david, jakob]));
  }

  getLocationText(locationSet: LocationSet) : string {
    return `(Lat: ${locationSet.coordinates.latitude}, Lon: ${locationSet.coordinates.longitude}, Radius: ${locationSet.radius}km)`
  }

  onNewLocationClick(session: TriangulationSession) : void {
    this.geoLocationService.getLocation().subscribe((position) => {
      this.position = position
      const longitude = this.position.coords.longitude;
      const latitude = this.position.coords.latitude;
      this.openNewLocationDialog(longitude, latitude, session);
    })
  }

  openNewLocationDialog(longitude: number, latitude: number, session: TriangulationSession) : void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { longitude: longitude, latitude: latitude };
    const dialogRef = this.dialog.open(NewLocationDialogComponent, dialogConfig);
    dialogRef.afterClosed().pipe(take(1)).subscribe((location: LocationSet | undefined) => {
      if(location) {
        session.locationSets.push(location);
      }
    })
  }

  onNewSessionsClick() : void {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.data = { longitude: longitude, latitude: latitude };
    // const dialogRef = this.dialog.open(NewLocationDialogComponent, dialogConfig);
    // dialogRef.afterClosed().pipe(take(1)).subscribe((location: LocationSet | undefined) => {
      
    // })
  }

}
