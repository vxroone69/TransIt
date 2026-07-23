import type { MetroStation, StationConnection } from "./transit.types.js";

export const metroStations: MetroStation[] = [
    {
        id: "majestic-purple",
        name: "Majestic",
        line: "purple",
        position: 1,
        coordinate: {
            lat: 12.9763,
            lng: 77.5713
        }
    },
    {
        id: "mg-road-purple",
        name: "MG Road",
        line: "purple",
        position: 2,
        coordinate: {
            lat: 12.9755,
            lng: 77.6068
        }
    },
    {
        id: "indiranagar-purple",
        name: "Indiranagar",
        line: "purple",
        position: 3,
        coordinate: {
            lat: 12.9784,
            lng: 77.6408
        }
    },
    {
        id: "byappanahalli-purple",
        name: "Baiyappanahalli",
        line: "purple",
        position: 4,
        coordinate: {
            lat: 12.9907,
            lng: 77.6529
        }
    },
    {
        id: "majestic-green",
        name: "Majestic",
        line: "green",
        position: 1,
        coordinate: {
            lat: 12.9763,
            lng: 77.5713
        }
    },
    {
        id: "chickpet-green",
        name: "Chickpet",
        line: "green",
        position: 2,
        coordinate: {
            lat: 12.9702,
            lng: 77.5747
        }
    },
    {
        id: "jayanagar-green",
        name: "Jayanagar",
        line: "green",
        position: 3,
        coordinate: {
            lat: 12.925,
            lng: 77.5938
        }
    },
    {
        id: "rv-road-green",
        name: "RV Road",
        line: "green",
        position: 4,
        coordinate: {
            lat: 12.9217,
            lng: 77.5802
        }
    }
];

export const stationConnections: StationConnection[] = [
    {
        fromStationId: "majestic-purple",
        toStationId: "mg-road-purple",
        distanceKm: 3.2
    },
    {
        fromStationId: "mg-road-purple",
        toStationId: "indiranagar-purple",
        distanceKm: 3.1
    },
    {
        fromStationId: "indiranagar-purple",
        toStationId: "byappanahalli-purple",
        distanceKm: 2.0
    },
    {
        fromStationId: "majestic-green",
        toStationId: "chickpet-green",
        distanceKm: 1.2
    },
    {
        fromStationId: "chickpet-green",
        toStationId: "jayanagar-green",
        distanceKm: 5.4
    },
    {
        fromStationId: "jayanagar-green",
        toStationId: "rv-road-green",
        distanceKm: 1.6
    },
    {
        fromStationId: "majestic-purple",
        toStationId: "majestic-green",
        distanceKm: 0.1
    }
];