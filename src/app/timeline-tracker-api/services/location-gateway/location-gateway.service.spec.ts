import {TestBed} from "@angular/core/testing";
import {HttpTestingController} from "@angular/common/http/testing";

import {LocationGatewayService} from "./location-gateway.service";
import {Location} from "../../types/location";
import {sampleLocationData} from "../../types/location.spec";
import {deepCopy, getTestImports, getTestProviders} from "../../../test-helpers.spec";
import {sampleApplicationConfig} from "../../../common/services/app-config/app-config.service.spec";


describe("LocationGatewayService", () => {
    let service: LocationGatewayService;
    let httpMock: HttpTestingController;
    const ttapiUrl = sampleApplicationConfig.ttapiBaseUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: getTestProviders(),
            imports: getTestImports(),
        });
        service = TestBed.inject(LocationGatewayService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });


    describe("retrieveLocation", () => {
        const expectedLocation = new Location(sampleLocationData);
        const locationId = expectedLocation.id;

        it("should return Location when api returns OK and location data", () => {
            // Arrange
            const body = sampleLocationData;

            // Act
            let actualLocation: Location;
            service.retrieveLocation(locationId).subscribe(location => actualLocation = location);

            // Assert
            const req = httpMock.expectOne(`${ttapiUrl}/location/${locationId}`);
            expect(req.request.method).toBe("GET");
            req.flush(body, {status: 200, statusText: "OK"});
            expect(actualLocation.equals(expectedLocation)).toBeTrue();
        });

        it("should return undefined when api returns 404", () => {
            // Arrange
            // Act
            let actualLocation: Location;
            service.retrieveLocation(locationId).subscribe(location => actualLocation = location);

            // Assert
            const req = httpMock.expectOne(`${ttapiUrl}/location/${locationId}`);
            expect(req.request.method).toBe("GET");
            req.flush(null, {status: 404, statusText: "Not Found"});
            expect(actualLocation).toBeUndefined();
        });
    });


    describe("retrieveLocationIds", () => {
        it("should return all existing locations", () => {
            // Arrange
            const expectedLocations: string[] = [
                "abad1dea-0000-4000-8000-00000000000",
                "deadbeef-0000-4000-8000-00000000000",
            ];

            // Act
            let actualLocationIds: string[] = [];
            service.retrieveLocationIds().subscribe(locationIds => actualLocationIds = locationIds);

            // Assert
            const req = httpMock.expectOne(`${ttapiUrl}/locations`);
            expect(req.request.method).toBe("GET");
            req.flush(expectedLocations);
            expect(actualLocationIds).toEqual(expectedLocations);
        });
    });

    describe("updateLocation", () => {
        it("should make get call for current state of Location", () => {
            // Arrange
            const location = new Location(sampleLocationData);

            // Act
            service.updateLocation(location).subscribe();

            // Assert
            const req = httpMock.expectOne(`${ttapiUrl}/location/${location.id}`);
            expect(req.request.method).toBe("GET");
            req.flush(sampleLocationData);
        });

        it("should make a patch call with the differences when the retrieved Location differs from provided", () => {
            // Arrange
            const modifiedLocationData = deepCopy(sampleLocationData);
            modifiedLocationData.name = "New Name";
            modifiedLocationData.tags.push("new-tag");
            const expectedPatch = JSON.stringify([
                {op: "replace", path: "/name", value: "New Name"},
                {op: "add", path: `/tags/0`, value: "new-tag"},
            ], null, 2);
            const modifiedLocation = new Location(modifiedLocationData);

            // Act
            service.updateLocation(modifiedLocation).subscribe();

            // Assert
            const getReq = httpMock.expectOne(`${ttapiUrl}/location/${sampleLocationData.id}`);
            expect(getReq.request.method).toBe("GET");
            getReq.flush(sampleLocationData);
            const patchReq = httpMock.expectOne(`${ttapiUrl}/location/${sampleLocationData.id}`);
            expect(patchReq.request.method).toBe("PATCH");
            expect(patchReq.request.body).toBe(expectedPatch);
        });

        it("should not modify tags when the retrieved Location returns same tags in different order", () => {
            // Arrange
            const locationDataWithReversedTags = deepCopy(sampleLocationData);
            locationDataWithReversedTags.tags.reverse();
            const expectedPatch = "[]";
            const modifiedLocation = new Location(locationDataWithReversedTags);

            // Act
            service.updateLocation(modifiedLocation).subscribe();

            // Assert
            const getReq = httpMock.expectOne(`${ttapiUrl}/location/${sampleLocationData.id}`);
            expect(getReq.request.method).toBe("GET");
            getReq.flush(sampleLocationData);
            const patchReq = httpMock.expectOne(`${ttapiUrl}/location/${sampleLocationData.id}`);
            expect(patchReq.request.method).toBe("PATCH");
            expect(patchReq.request.body).toBe(expectedPatch);
        });
    });
});
