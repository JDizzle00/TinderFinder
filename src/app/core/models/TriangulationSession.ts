import { LocationSet } from "./LocationSet";

export interface TriangulationSession {
    name: string;
    description?: string;
    locationSets: LocationSet[];
    expanded?: boolean;
}