import type {
    Location,
    RouteCandidate,
    RouteSegment,
    TravelMode,
    UserPreference
} from "../domain/types.js";
import type { StationRepository } from "../transit/stationRepository.js";
import type { MetroStation } from "../transit/transit.types.js";
import { estimateCostInr, estimateDurationMinutes } from "./pricing.js";

interface OptimizeRoutesInput {
    source: Location;
    destination: Location;
    preference: UserPreference;
}

interface OptimizeRoutesDependencies {
    stationRepository: StationRepository;
}

// These are the non-metro modes we support for first-mile and last-mile travel.
const roadAndWalkingModes: TravelMode[] = ["walk", "bike_taxi", "auto"];

export function optimizeRoutes(
    input: OptimizeRoutesInput,
    dependencies: OptimizeRoutesDependencies
): RouteCandidate[] {
    const sourceStations = dependencies.stationRepository.findNearestStations(input.source, 2);
    const destinationStations = dependencies.stationRepository.findNearestStations(input.destination, 2);

    const candidates: RouteCandidate[] = [];

    for (const sourceStation of sourceStations) {
        for (const destinationStation of destinationStations) {
            for (const firstMileMode of roadAndWalkingModes) {
                for (const lastMileMode of roadAndWalkingModes) {
                    const segments = buildSegments({
                        source: input.source,
                        destination: input.destination,
                        sourceStation,
                        destinationStation,
                        firstMileMode,
                        lastMileMode
                    });

                    const totalDistanceKm = sum(segments.map((segment) => segment.distanceKm));
                    const totalDurationMinutes = sum(segments.map((segment) => segment.durationMinutes));
                    const totalCostInr = sum(segments.map((segment) => segment.costInr));

                    const walkingDistanceKm = sum(
                        segments
                            .filter((segment) => segment.mode === "walk")
                            .map((segment) => segment.distanceKm)
                    );

                    const candidate: RouteCandidate = {
                        id: `${sourceStation.id}-${destinationStation.id}-${firstMileMode}-${lastMileMode}`,
                        title: `${formatMode(firstMileMode)} + Metro + ${formatMode(lastMileMode)}`,
                        segments,
                        totalDistanceKm: round(totalDistanceKm),
                        totalDurationMinutes,
                        totalCostInr,
                        walkingDistanceKm: round(walkingDistanceKm),
                        transfers: sourceStation.line === destinationStation.line ? 0 : 1,
                        score: 0
                    };

                    candidate.score = scoreRoute(candidate, input.preference);

                    candidates.push(candidate);
                }
            }
        }
    }

    return candidates
        .filter(isReasonableRoute)
        .sort((a, b) => a.score - b.score)
        .slice(0, 8);
}

function buildSegments(params: {
    source: Location;
    destination: Location;
    sourceStation: MetroStation;
    destinationStation: MetroStation;
    firstMileMode: TravelMode;
    lastMileMode: TravelMode;
}): RouteSegment[] {
    const firstMileDistanceKm = distanceInKm(params.source, params.sourceStation.coordinate);
    const metroDistanceKm = estimateMetroDistanceKm(params.sourceStation, params.destinationStation);
    const lastMileDistanceKm = distanceInKm(params.destinationStation.coordinate, params.destination);

    return [
        {
            mode: params.firstMileMode,
            from: params.source.label || "Source",
            to: params.sourceStation.name,
            distanceKm: round(firstMileDistanceKm),
            durationMinutes: estimateDurationMinutes(params.firstMileMode, firstMileDistanceKm),
            costInr: estimateCostInr(params.firstMileMode, firstMileDistanceKm),
            description: `${formatMode(params.firstMileMode)} to ${params.sourceStation.name} metro station`
        },
        {
            mode: "metro",
            from: params.sourceStation.name,
            to: params.destinationStation.name,
            distanceKm: round(metroDistanceKm),
            durationMinutes: estimateDurationMinutes("metro", metroDistanceKm),
            costInr: estimateCostInr("metro", metroDistanceKm),
            description: `Metro from ${params.sourceStation.name} to ${params.destinationStation.name}`
        },
        {
            mode: params.lastMileMode,
            from: params.destinationStation.name,
            to: params.destination.label || "Destination",
            distanceKm: round(lastMileDistanceKm),
            durationMinutes: estimateDurationMinutes(params.lastMileMode, lastMileDistanceKm),
            costInr: estimateCostInr(params.lastMileMode, lastMileDistanceKm),
            description: `${formatMode(params.lastMileMode)} from ${params.destinationStation.name} metro station`
        }
    ];
}

function scoreRoute(route: RouteCandidate, preference: UserPreference): number {
    if (preference === "cheapest") {
        return route.totalCostInr;
    }

    if (preference === "fastest") {
        return route.totalDurationMinutes;
    }

    if (preference === "less_walking") {
        return route.walkingDistanceKm * 100 + route.totalDurationMinutes;
    }

    if (preference === "fewer_transfers") {
        return route.transfers * 1000 + route.totalDurationMinutes;
    }

    // balanced
    return route.totalCostInr * 0.6 + route.totalDurationMinutes * 2 + route.transfers * 20;
}

function isReasonableRoute(route: RouteCandidate): boolean {
    // Avoid routes where walking becomes unrealistic.
    return route.walkingDistanceKm <= 3;
}

function estimateMetroDistanceKm(sourceStation: MetroStation, destinationStation: MetroStation): number {
    // This is simplified.
    // Later, we will calculate real metro path distance using station connections.
    return distanceInKm(sourceStation.coordinate, destinationStation.coordinate);
}

function distanceInKm(a: Location, b: Location): number {
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

function formatMode(mode: TravelMode): string {
    if (mode === "bike_taxi") {
        return "Bike Taxi";
    }

    return mode.charAt(0).toUpperCase() + mode.slice(1);
}

function sum(values: number[]): number {
    return values.reduce((total, value) => total + value, 0);
}

function round(value: number): number {
    return Math.round(value * 100) / 100;
}