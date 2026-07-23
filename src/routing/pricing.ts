import type { TravelMode } from "../domain/types.js";

// Estimate cost in Indian Rupees for a travel segment.
//
// We keep the rules simple:
// - walking is free
// - metro fare grows slowly with distance
// - bike taxi and auto have base fare + per-km fare
export function estimateCostInr(mode: TravelMode, distanceKm: number): number {
    if (mode === "walk") {
        return 0;
    }

    if (mode === "metro") {
        if (distanceKm <= 2) return 10;
        if (distanceKm <= 5) return 20;
        if (distanceKm <= 12) return 30;
        if (distanceKm <= 21) return 40;
        return 50;
    }

    if (mode === "bike_taxi") {
        return Math.round(25 + distanceKm * 12);
    }

    // auto
    return Math.round(40 + distanceKm * 18);
}

// Estimate duration in minutes for a travel segment.
//
// These are average speeds:
// - walking: 4.5 km/h
// - metro: 30 km/h including station delays
// - bike taxi: 22 km/h
// - auto: 18 km/h
export function estimateDurationMinutes(mode: TravelMode, distanceKm: number): number {
    if (mode === "walk") {
        return Math.ceil((distanceKm / 4.5) * 60);
    }

    if (mode === "metro") {
        return Math.ceil((distanceKm / 30) * 60);
    }

    if (mode === "bike_taxi") {
        return Math.ceil(4 + (distanceKm / 22) * 60);
    }

    // auto
    return Math.ceil(5 + (distanceKm / 18) * 60);
}