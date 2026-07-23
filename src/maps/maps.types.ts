import type { Coordinate } from "../domain/types.js";

export interface Place {
    name: string,
    address: string,
    coordinate: Coordinate
}

export interface GeocodeResult {
    query: string;
    places: Place[];
}

export interface RoutePolyLine {
    mode: "walk" | "metro" | "auto" | "bike_taxi";
    path: Coordinate[];
}

