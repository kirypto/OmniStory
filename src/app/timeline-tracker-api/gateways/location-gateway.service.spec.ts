import {TestBed} from "@angular/core/testing";

import {LocationGatewayService} from "./location-gateway.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Location, LocationData} from "../domain-types/location";
import {expectLocationToMatch} from "../domain-types/location.spec";

describe("LocationGatewayService", () => {
    let service: LocationGatewayService;
    let httpMock: HttpTestingController;
    // noinspection HttpUrlsUsage
    const ttapiUrl = "http://172.16.1.101:1337";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(LocationGatewayService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });


    describe("getLocation", () => {
        const locationId = "location-00000000-0000-4000-8000-000000000000";
        const locationData: LocationData = {
            id: locationId,
            name: "a name",
            description: "a description",
            span: {
                latitude: {low: 11034.738, high: 11066.318},
                longitude: {low: 5457.91, high: 5483.174},
                altitude: {low: 0.972, high: 1.034},
                continuum: {low: -9383.0, high: Infinity},
                reality: {low: 0, high: 0},
            },
            tags: new Set(["tag1", "tag2"]),
            metadata: new Map(Object.entries({meta_key: "meta_val"}))
        };

        it("should return Location when api returns OK and location data", () => {
            // Arrange
            const body = locationData;

            // Act
            let actualLocation: Location;
            service.getLocation(locationId).subscribe(location => actualLocation = location);

            // Assert
            const req = httpMock.expectOne(`${ttapiUrl}/api/location/${locationId}`);
            expect(req.request.method).toBe("GET");
            req.flush(body, {status: 200, statusText: "OK"});
            // noinspection JSUnusedAssignment
            expectLocationToMatch(actualLocation, locationData);
        });

        it("should return undefined when api returns 404", () => {
            // Arrange
            // Act
            let actualLocation: Location;
            service.getLocation(locationId).subscribe(location => actualLocation = location);

            // Assert
            const req = httpMock.expectOne(`${ttapiUrl}/api/location/${locationId}`);
            expect(req.request.method).toBe("GET");
            req.flush(null, {status: 404, statusText: "Not Found"});
            // noinspection JSUnusedAssignment
            expect(actualLocation).toBeUndefined();
        });
    });


    describe("getLocationIds", () => {
        it("should return all existing locations", () => {
            // Arrange
            const expectedLocations: string[] = [
                "abad1dea-0000-4000-8000-00000000000",
                "deadbeef-0000-4000-8000-00000000000",
            ];

            // Act
            let actualLocationIds: string[] = [];
            service.getLocationIds().subscribe(locationIds => actualLocationIds = locationIds);

            // Assert
            const req = httpMock.expectOne(`${ttapiUrl}/api/locations`);
            expect(req.request.method).toBe("GET");
            req.flush(expectedLocations);
            expect(actualLocationIds).toEqual(expectedLocations);
        });
    });
});
