import type { Coordinate } from "../domain/types.js";
import type { MetroStation } from "./transit.types.js";

export interface StationRepository {
    listStations(): MetroStation[];
    findById(stationId: string): MetroStation | undefined;
    findNearestStations(coordinate: Coordinate, limit: number): MetroStation[];
}