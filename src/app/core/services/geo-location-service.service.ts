import { Injectable } from '@angular/core';
import { Coordinates, LocationSet } from '@core/models';
import { Observable } from 'rxjs';
import * as turf from '@turf/turf';

const GEOLOCATION_ERRORS: Record<number, string> = {
  1: 'You have rejected access to your location',
  2: 'Unable to determine your location',
  3: 'Service timeout has been reached',
};

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {


  getLocation(geoLocationOptions: PositionOptions = { timeout: 5000 }): Observable<GeolocationPosition> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error('Browser does not support location services');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position);
          observer.complete();
        },
        (err) => {
          observer.error(GEOLOCATION_ERRORS[err.code] || 'Unknown error');
        },
        geoLocationOptions
      );
    });
  }

  getCoordinatesFromTriangulation(points: LocationSet[]) : Coordinates | null {
    if (points.length < 3) {
      throw new Error('You must provide at least 3 coordinates.');
    }
    points.forEach((point) => {
      if(point.coordinates.longitude == undefined || point.coordinates.latitude == undefined || point.radius == 0) {
        throw new Error('Missing coordinates or unset radius in ' + point.addressName);
      }
    })

    let result: any = turf.circle([points[0].coordinates.longitude!, points[0].coordinates.latitude!], points[0].radius, { units: 'kilometers' });

    for (let i = 1; i < points.length; i++) {
      const circle = turf.circle([points[i].coordinates.longitude!, points[i].coordinates.latitude!], points[i].radius, { units: 'kilometers' });
      const intersection = turf.intersect(turf.featureCollection([result, circle])); //Neues Polygon
      if (intersection) {
        result = intersection;
      }
    }

    if (result.geometry.type === 'Polygon') {
      const [lon, lat] = turf.center(result).geometry.coordinates;
      return { longitude: lon, latitude: lat };
    }

    return null;
  }
}
