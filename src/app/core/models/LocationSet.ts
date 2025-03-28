import { Coordinates } from "./Coordinates";

export class LocationSet {
    addressName: string = '';
    coordinates: Coordinates = {longitude: undefined, latitude: undefined};
    radius: number = 0;
    saved = true;
}