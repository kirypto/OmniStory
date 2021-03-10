import {Location, LocationData} from "./location";

export function expectLocationToMatch(actual: Location, locationData: LocationData): void {
    expect(actual.id).toEqual(locationData.id);
    expect(actual.name).toEqual(locationData.name);
    expect(actual.description).toEqual(locationData.description);
    expect(actual.span).toEqual(locationData.span);
    expect(actual.tags).toEqual(locationData.tags);
    expect(actual.metadata).toEqual(locationData.metadata);
}

describe("Location", () => {
    const locationData: LocationData = {
        id: "location-00000000-0000-4000-8000-000000000000",
        name: "a name",
        description: "a description",
        span: {
            latitude: {low: 11034.738, high: 11066.318},
            longitude: {low: 5457.91, high: 5483.174},
            altitude: {low: 0.972, high: 1.034},
            continuum: {low: -9383.0, high: Infinity},
            reality: {low: 0, high: 0},
        },
        tags: ["tag1"],
        metadata: new Map(Object.entries({meta_key: "meta_val"}))
    };

    describe("constructor", () => {
        it("should create an instance of Location class", () => {
            // Arrange
            // Act
            const actual = new Location(locationData);

            // Assert
            expect(actual).toBeTruthy();
            expect(actual).toBeInstanceOf(Location);
        });

        it("should initialize properties", () => {
            // Arrange
            // Act
            const actual = new Location(locationData);

            // Assert
            expectLocationToMatch(actual, locationData);
        });
    });
});
