import type { Coordinate } from "../domain/types.js";
import type { StationRepository } from "./stationRepository.js";
import type { MetroStation } from "./transit.types.js";

// This class is an in-memory implementation of StationRepository.
//
// "implements StationRepository" means TypeScript will check that this class
// provides every method required by the StationRepository interface.
export class InMemoryStationRepository implements StationRepository {
    constructor(private readonly stations: MetroStation[]) { }

    listStations(): MetroStation[] {
        // Return a copy so callers cannot accidentally mutate our internal array.
        return [...this.stations];
    }

    findById(stationId: string): MetroStation | undefined {
        return this.stations.find((station) => station.id === stationId);
    }

    findNearestStations(coordinate: Coordinate, limit: number): MetroStation[] {
        return [...this.stations]
            .sort((a, b) => {
                return distanceInKm(coordinate, a.coordinate) - distanceInKm(coordinate, b.coordinate);
            })
            .slice(0, limit);
    }
}

// This helper estimates distance between two coordinates using the Haversine formula.
//
// You do not need to memorize the formula.
// The backend idea is more important:
// route planning often needs distance calculations.
function distanceInKm(a: Coordinate, b: Coordinate): number {
    const earthRadiusKm = 6371;

    const latDistance = toRadians(b.lat - a.lat);
    const lngDistance = toRadians(b.lng - a.lng);

    const startLat = toRadians(a.lat);
    const endLat = toRadians(b.lat);

    const haversineValue =
        Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
        Math.cos(startLat) *
        Math.cos(endLat) *
        Math.sin(lngDistance / 2) *
        Math.sin(lngDistance / 2);

    const centralAngle =
        2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue));

    return earthRadiusKm * centralAngle;
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}