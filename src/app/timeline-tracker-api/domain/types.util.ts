import {Entity, EntityType, Event, Location, Traveler, World} from "@ttapi/domain/types.model";


export function newEntity(entityType: EntityType): Entity {
    switch (entityType) {
        case "World":
            return newWorld();
        case "Location":
            return newLocation();
        case "Traveler":
            return newTraveler();
        case "Event":
            return newEvent();
    }
}

export function newWorld(): World {
    return {
        id: "", name: "", description: "", tags: [], attributes: {},
    };
}

export function newLocation(): Location {
    return {
        id: "", name: "", description: "", span: {
            latitude: {low: 0, high: 0}, longitude: {low: 0, high: 0}, altitude: {low: 0, high: 0},
            continuum: {low: 0, high: 0}, reality: [0],
        }, tags: [], attributes: {},
    };
}

export function newTraveler(): Traveler {
    return {
        id: "", name: "", description: "", journey: [
            {position: {latitude: 0, longitude: 0, altitude: 0, continuum: 0, reality: 0}, movement_type: "immediate"},
        ], tags: [], attributes: {},
    };
}

export function newEvent(): Event {
    return {
        id: "", name: "", description: "", span: {
            latitude: {low: 0, high: 0}, longitude: {low: 0, high: 0}, altitude: {low: 0, high: 0},
            continuum: {low: 0, high: 0}, reality: [0],
        }, affected_locations: [], affected_travelers: [], tags: [], attributes: {},
    };
}