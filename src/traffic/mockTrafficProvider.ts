import type { Coordinate } from "../domain/types.js";
import type { RoadTravelMode, TrafficProvider } from "./trafficProvider.js";
import type { TrafficEstimate, TrafficLevel } from "./traffic.types.js";

export class MockTrafficProvider implements TrafficProvider {
    async estimateRoadTravel(
        from: Coordinate,
        to: Coordinate,
        mode: RoadTravelMode
    ): Promise<TrafficEstimate> {
        const distanceKm = distanceInKm(from, to);

        const baseDurationMinutes = estimateBaseDuration(mode, distanceKm);
        const trafficLevel = estimateTrafficLevel(distanceKm);
        const trafficMultiplier = getTrafficMultiplier(trafficLevel);

        return {
            from,
            to,
            mode,
            distanceKm: round(distanceKm),
            baseDurationMinutes,
            trafficDurationMinutes: Math.ceil(baseDurationMinutes * trafficMultiplier),
            trafficLevel
        };
    }
}

function estimateBaseDuration(mode: RoadTravelMode, distanceKm: number): number {
    if (mode === "bike_taxi") {
        return Math.ceil(4 + (distanceKm / 22) * 60);
    }

    return Math.ceil(5 + (distanceKm / 18) * 60);
}

function estimateTrafficLevel(distanceKm: number): TrafficLevel {
    // Simple mock rule:
    // longer road journeys are more likely to face traffic delays.
    if (distanceKm <= 2) {
        return "clear";
    }

    if (distanceKm <= 5) {
        return "moderate";
    }

    return "heavy";
}

function getTrafficMultiplier(level: TrafficLevel): number {
    if (level === "clear") {
        return 1;
    }

    if (level === "moderate") {
        return 1.25;
    }

    return 1.6;
}

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

function round(value: number): number {
    return Math.round(value * 100) / 100;
}

// Export one default instance for the app.
// Later, we can swap this with GoogleTrafficProvider or MapboxTrafficProvider.
export const trafficProvider = new MockTrafficProvider();