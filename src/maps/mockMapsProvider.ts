import type { Coordinate } from "../domain/types.js";
import type { MapsProvider } from "./maps.provider.js";
import type { GeocodeResult, Place, RoutePolyLine } from "./maps.types.js";


const mockPlaces: Place[] = [
    {
        name: "Majestic",
        address: "Majestic, Bengaluru, Karnataka",
        coordinate: {
            lat: 12.9763,
            lng: 77.5713
        }
    },
    {
        name: "Indiranagar",
        address: "Indiranagar, Bengaluru, Karnataka",
        coordinate: {
            lat: 12.9784,
            lng: 77.6408
        }
    },
    {
        name: "Whitefield",
        address: "Whitefield, Bengaluru, Karnataka",
        coordinate: {
            lat: 12.9698,
            lng: 77.7499
        }
    },
    {
        name: "Jayanagar",
        address: "Jayanagar, Bengaluru, Karnataka",
        coordinate: {
            lat: 12.925,
            lng: 77.5938
        }
    }
];

export class MockMapsProvider implements MapsProvider {
    async geocode(query: string): Promise<GeocodeResult> {

        const normalizedQuery = query.toLowerCase();
        const places = mockPlaces.filter((place) => {
            return (
                place.name.toLowerCase().includes(normalizedQuery) ||
                place.address.toLowerCase().includes(normalizedQuery)
            );
        });

        return {
            query,
            places
        };
    }

    async getPolyLine(from: Coordinate, to: Coordinate): Promise<RoutePolyLine> {
        return {
            mode: "walk",
            path: [from, to]
        };
    }
}

export const mapsProvider = new MockMapsProvider();