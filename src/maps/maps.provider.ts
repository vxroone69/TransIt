//contract for any maps provicder
import type { Coordinate } from "../domain/types.js";
import type { GeocodeResult, RoutePolyLine } from "./maps.types.js";

export interface MapsProvider {

    geocode(query: string): Promise<GeocodeResult>;
    getPolyLine(from: Coordinate, to: Coordinate): Promise<RoutePolyLine>;
}