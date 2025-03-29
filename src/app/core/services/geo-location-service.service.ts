import { Injectable } from '@angular/core';
import { Coordinates, LocationSet } from '@core/models';
import { Observable, take } from 'rxjs';
import * as turf from '@turf/turf';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const GEOLOCATION_ERRORS: Record<number, string> = {
  1: 'You have rejected access to your location',
  2: 'Unable to determine your location',
  3: 'Service timeout has been reached',
};

const GEO_REVERSE_SERVICE_URL = 'https://nominatim.openstreetmap.org/reverse?key={apiKey}&format=json&addressdetails=1&lat={lat}&lon={lon}';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {

  constructor(private httpClient: HttpClient) {}


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


  reverseGeo(coordinates: Coordinates) : Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if(!coordinates.latitude || !coordinates.longitude) {
        return reject(new Error("Invalid coordinates: Latitude and longitude are required."));
      }
      const geoReverseApiKey = environment.geoReverseKey;
      const serviceUrl = GEO_REVERSE_SERVICE_URL
        .replace(new RegExp('{lon}', 'ig'), `${coordinates.longitude}`)
        .replace(new RegExp('{lat}', 'ig'), `${coordinates.latitude}`)
        .replace(new RegExp('{apiKey}', 'ig'), `${geoReverseApiKey}`)
      this.httpClient.get(serviceUrl).pipe(take(1)).subscribe({
        next: (data: any) => {
          if (!data) return reject(new Error("No data received from the geolocation service."));
    
          const display_name = data.display_name;
          const address = data.address ? data.address : {};
    
          const building = [address.building, address.mall, address.theatre].filter(Boolean).join(' ');
          const zipCity = [address.postcode, address.city].filter(Boolean).join(' ');
          const streetNumber = [
            address.street, address.road, address.footway, address.pedestrian, address.house_number
          ].filter(Boolean).join(' ');
    
          resolve([streetNumber, zipCity, building].filter(Boolean).join(', ') || display_name);
        },
        error: (err) => reject(new Error(`Reverse geocoding failed: ${err.message || err}`))
      })
    })
  }
}
