import type { Coordinate } from "../domain/types.js";

export type MetroLine = "yellow" | "green" | "purple";

export interface MetroStation {
    id: string,
    name: string,
    line: MetroLine,
    position: number,
    coordinate: Coordinate
}

export interface StationConnection {
    fromStationId: string,
    toStationId: string;
    distanceKm: number;
}