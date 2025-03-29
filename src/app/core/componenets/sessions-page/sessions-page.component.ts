import { Component, OnInit } from '@angular/core';
import { Coordinates, LocationSet, TriangulationSession } from '@core/models';
import { GeoLocationService, SessionService } from '@core/services';
import { AppCommonModule } from 'src/app/app.common.module';
import { NewLocationDialogComponent } from '../new-location-dialog/new-location-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs';
import { NewSessionDialogComponent } from '../new-session-dialog/new-session-dialog.component';
import { MapViewerComponent } from "../map-viewer/map-viewer.component";

@Component({
  selector: 'app-sessions-page',
  imports: [AppCommonModule, MapViewerComponent],
  templateUrl: './sessions-page.component.html',
  styleUrl: './sessions-page.component.scss'
})
export class SessionsPageComponent implements OnInit {

  position?: GeolocationPosition;
  sessions: TriangulationSession[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly geoLocationService: GeoLocationService,
    private readonly sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.loadSessions();
    this.testTriangulation()
  }

  loadSessions() : void {
    this.sessions = this.sessionService.loadSessionsFromLocalStorage() ?? [];
  }

  saveSessions() : void {
    this.sessionService.saveSessions(this.sessions);
  }

  testTriangulation() : void {
    const jannis: LocationSet = {coordinates: {latitude: 48.18786894380662, longitude: 11.503847044646422}, radius: 20, addressName: "Test", saved: true, description: ''};
    const david: LocationSet = {coordinates: {latitude: 48.155519934026515, longitude: 11.536818686203635}, radius: 20, addressName: "Test", saved: true, description: ''};
    const jakob: LocationSet = {coordinates: {latitude: 48.13016493283865, longitude: 11.511707881498408}, radius: 20, addressName: "Test", saved: true, description: ''};
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
        this.geoLocationService.reverseGeo(location.coordinates).then((addressName) => {
          location.description = addressName != undefined && addressName !== '' ? addressName : this.getLocationText(location);
          session.locationSets.push(location);
          this.saveSessions();
        })
      }
    })
  }

  onNewSessionsClick() : void {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(NewSessionDialogComponent, dialogConfig);
    dialogRef.afterClosed().pipe(take(1)).subscribe((returnSession: TriangulationSession | undefined) => {
      if(returnSession) {
        returnSession.expanded = true;
        this.sessions.push(returnSession);
        this.saveSessions();
      }
    })
  }

  onLocationDelete(sessionIndex: number, locationIndex: number) : void {
    this.sessions[sessionIndex].locationSets.splice(locationIndex, 1);
    this.saveSessions();
  }
  onSessionDelete(sessionIndex: number) : void {
    this.sessions.splice(sessionIndex, 1);
    this.saveSessions();
  }

  onTriangulateSession(session: TriangulationSession) : void {
    if(this.canTriangulateSession(session)) {
      const result = this.geoLocationService.getCoordinatesFromTriangulation(session.locationSets);
      if(result) session.result = result;
      this.saveSessions();
    }
  }

  canTriangulateSession(session: TriangulationSession) : boolean {
    return session.locationSets.length >= 3 && this.areAllLocationSetsValid(session.locationSets);
  }

  areAllLocationSetsValid(locationSets: LocationSet[]) : boolean {
    return locationSets.every(locationSet =>
      locationSet.coordinates.latitude !== undefined &&
      locationSet.coordinates.longitude !== undefined &&
      locationSet.radius !== 0
    );
  }

  isPanelExpandedForSession(session: TriangulationSession) : boolean {
    return session.expanded ?? false;
  }

}
