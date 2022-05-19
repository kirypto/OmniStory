import {Location, LocationData} from "./location";
import {components} from "../schema";
import {deepCopy} from "../../test-helpers.spec";

type LocationSpec = components["schemas"]["ExistingLocation"];

export const sampleLocationData: LocationSpec = {
    id: "location-00000000-0000-4000-8000-000000000000",
    name: "a name",
    description: "a description",
    span: {
        latitude: {low: 11034.738, high: 11066.318},
        longitude: {low: 5457.91, high: 5483.174},
        altitude: {low: 0.972, high: 1.034},
        continuum: {low: -9383.0, high: Infinity},
        reality: [0],
    },
    tags: ["tag1", "tag2"],
    metadata: {meta_key: "meta_val"},
};

describe("Location", () => {

    describe("constructor", () => {
        it("should create an instance of Location class", () => {
            // Arrange
            // Act
            const actual = new Location(sampleLocationData);

            // Assert
            expect(actual).toBeTruthy();
            expect(actual).toBeInstanceOf(Location);
        });

        it("should initialize properties", () => {
            // Arrange
            // Act
            const actual = new Location(sampleLocationData);

            // Assert
            expect(actual.name).toEqual(sampleLocationData.name);
            expect(actual.description).toEqual(sampleLocationData.description);
            expect(actual.span.latitude.low).toEqual(sampleLocationData.span.latitude.low);
            expect(actual.tags.size).toEqual(sampleLocationData.tags.length);
            expect(actual.metadata.size).toEqual(Object.keys(sampleLocationData.metadata).length);
        });
    });

    describe("equals", () => {
        it("should return true when all attributes are equivalent", () => {
            // Arrange
            const location1 = new Location(sampleLocationData);
            const location2 = new Location(sampleLocationData);

            // Act
            const actual = location1.equals(location2);

            // Assert
            expect(actual).toBeTrue();
        });

        it("should return false when name is different", () => {
            // Arrange
            const location1 = new Location(sampleLocationData);
            const otherLocationData = deepCopy(sampleLocationData);
            otherLocationData.name = "something else";
            const location2 = new Location(otherLocationData);

            // Act
            const actual = location1.equals(location2);

            // Assert
            expect(actual).toBeFalse();
        });

        it("should return false when description is different", () => {
            // Arrange
            const location1 = new Location(sampleLocationData);
            const otherLocationData = deepCopy(sampleLocationData);
            otherLocationData.description = "something else";
            const location2 = new Location(otherLocationData);

            // Act
            const actual = location1.equals(location2);

            // Assert
            expect(actual).toBeFalse();
        });

        it("should return false when span is different", () => {
            // Arrange
            const location1 = new Location(sampleLocationData);
            const otherLocationData = deepCopy(sampleLocationData);
            otherLocationData.span.latitude.low = 55;
            const location2 = new Location(otherLocationData);

            // Act
            const actual = location1.equals(location2);

            // Assert
            expect(actual).toBeFalse();
        });

        it("should return false when tags is different", () => {
            // Arrange
            const location1 = new Location(sampleLocationData);
            const otherLocationData = deepCopy(sampleLocationData);
            otherLocationData.tags[0] = "other tag";
            const location2 = new Location(otherLocationData);

            // Act
            const actual = location1.equals(location2);

            // Assert
            expect(actual).toBeFalse();
        });

        it("should return false when metadata is different", () => {
            // Arrange
            const location1 = new Location(sampleLocationData);
            const otherLocationData = deepCopy(sampleLocationData);
            otherLocationData.metadata.otherKey = "other val";
            const location2 = new Location(otherLocationData);

            // Act
            const actual = location1.equals(location2);

            // Assert
            expect(actual).toBeFalse();
        });
    });

    describe("getData", () => {
        it("should sort tags", () => {
            // Arrange
            const locationData = deepCopy(sampleLocationData);
            locationData.tags.sort((tag1, tag2) => tag1.localeCompare(tag2));
            const expectedTags = [...locationData.tags];
            locationData.tags.reverse();
            const location = new Location(locationData);

            // Act
            const actual = location.getData().tags;

            // Assert
            expect(actual).toEqual(expectedTags);
        });

        it("should sort metadata", () => {
            // Arrange
            const locationData = deepCopy(sampleLocationData);
            locationData.tags.sort((tag1, tag2) => tag1.localeCompare(tag2));
            const expectedTags = [...locationData.tags];
            locationData.tags.reverse();
            const location = new Location(locationData);

            // Act
            const actual = location.getData().tags;

            // Assert
            expect(actual).toEqual(expectedTags);
        });
    });
});
