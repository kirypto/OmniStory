import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

import {LocationGatewayService} from "./location-gateway.service";
import {Location} from "../types/location";
import {sampleLocationData} from "../types/location.spec";

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
        const expectedLocation = new Location(sampleLocationData);
        const locationId = expectedLocation.id;

        it("should return Location when api returns OK and location data", () => {
            // Arrange
            const body = sampleLocationData;

            // Act
            let actualLocation: Location;
            service.getLocation(locationId).subscribe(location => actualLocation = location);

            // Assert
            const req = httpMock.expectOne(`${ttapiUrl}/api/location/${locationId}`);
            expect(req.request.method).toBe("GET");
            req.flush(body, {status: 200, statusText: "OK"});
            expect(actualLocation.equals(expectedLocation)).toBeTrue();
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
