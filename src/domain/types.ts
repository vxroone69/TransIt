export interface Coordinate {
    lat: number;
    lng: number;
}

export interface Location extends Coordinate {
    label?: string;
}

export type TravelMode = "walk" | "metro" | "auto" | "bike_taxi";

export type UserPreference =
    | "cheapest"
    | "fastest"
    | "balanced"
    | "less_walking"
    | "fewer_transfers";

export interface RouteSegment {
    mode: TravelMode;
    from: string;
    to: string;
    distanceKm: number;
    durationMinutes: number;
    costInr: number;
    description: string;
}

export interface RouteCandidate {
    id: string;
    title: string;
    segments: RouteSegment[];
    totalDistanceKm: number;
    totalDurationMinutes: number;
    totalCostInr: number;
    walkingDistanceKm: number;
    transfers: number;
    score: number;
}

export interface AIIntent {
    preference: UserPreference;
    avoidLongWalks: boolean;
    avoidTransfers: boolean;
    prioritizeReliability: boolean;
}

export interface AIRecommendation {
    routeId: string;
    summary: string;
    reasons: string[];
    tradeoffs: string[];
}