import { Coordinates } from "./Coordinates";
import { LocationSet } from "./LocationSet";

export interface TriangulationSession {
    name: string;
    description?: string;
    locationSets: LocationSet[];
    expanded?: boolean;
    result?: Coordinates;
}