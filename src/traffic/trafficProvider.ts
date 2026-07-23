import type { Coordinate, TravelMode } from "../domain/types.js";
import type { TrafficEstimate } from "./traffic.types.js";

// RoadTravelMode means only the modes that use roads and are affected by traffic.
export type RoadTravelMode = Extract<TravelMode, "auto" | "bike_taxi">;

export interface TrafficProvider {
    estimateRoadTravel(
        from: Coordinate,
        to: Coordinate,
        mode: RoadTravelMode
    ): Promise<TrafficEstimate>;
}