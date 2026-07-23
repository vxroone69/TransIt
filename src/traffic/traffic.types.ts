import type { Coordinate, TravelMode } from "../domain/types.js";

// TrafficLevel is a simple way to describe road congestion.
//
// clear    -> road is moving well
// moderate -> some delay
// heavy    -> significant delay
export type TrafficLevel = "clear" | "moderate" | "heavy";

// TrafficEstimate represents road travel information between two points.
//
// Later, a real traffic API can fill this data.
// For now, our mock provider will estimate it.
export interface TrafficEstimate {
    from: Coordinate;
    to: Coordinate;
    mode: Extract<TravelMode, "auto" | "bike_taxi">;
    distanceKm: number;
    baseDurationMinutes: number;
    trafficDurationMinutes: number;
    trafficLevel: TrafficLevel;
}