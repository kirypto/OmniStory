import {ComponentFixture, TestBed} from "@angular/core/testing";

import {EntityFinderComponent} from "./entity-finder.component";
import {LocationGatewayService} from "../../gateways/location-gateway.service";
import {Location, LocationData} from "../../entities/location";
import {of} from "rxjs";
import SpyObj = jasmine.SpyObj;


describe("EntityFinderComponent", () => {
    let component: EntityFinderComponent;
    let fixture: ComponentFixture<EntityFinderComponent>;
    let locationGatewayServiceMock: SpyObj<LocationGatewayService>;

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
        tags: new Set(["tag1", "tag2"]),
        metadata: new Map(Object.entries({meta_key: "meta_val"}))
    };
    const location = new Location(locationData);

    beforeEach(async () => {
        const locationGatewaySpy = jasmine.createSpyObj("LocationGatewayService", [
            "getLocation", "getLocationIds"
        ]);
        await TestBed.configureTestingModule({
            declarations: [EntityFinderComponent],
            providers: [{
                provide: LocationGatewayService, useValue: locationGatewaySpy
            }],
        }).compileComponents();
        locationGatewayServiceMock = TestBed.inject(LocationGatewayService) as SpyObj<LocationGatewayService>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EntityFinderComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        // Arrange
        // Act
        // Assert
        expect(component).toBeTruthy();
    });

    describe("locationNamesById", () => {
        it("should return the id and name of each stored entity", () => {
            // Arrange
            (component as any)._entitiesById.set(location.id, location);

            // Act
            const actual = component.entityIdsAndNames;

            // Assert
            expect(actual.get(location.id)).toEqual(location.name);
        });

        it("should return in form supporting ReadonlyMap iteration", () => {
            // Arrange
            (component as any)._entitiesById.set(location.id, location);

            // Act
            const actual = (component.entityIdsAndNames as ReadonlyMap<string, string>);

            // Assert
            expect(actual).toHaveSize(1);
            expect(actual.get(location.id)).toEqual(location.name);
        });
    });

    describe("findEntities", () => {
        it("should retrieve locations from gateway and persist when given 'location'", () => {
            // Arrange
            locationGatewayServiceMock.getLocation.and.returnValue(of(location));
            locationGatewayServiceMock.getLocationIds.and.returnValue(of([location.id]));

            // Act
            component.findEntities("location");
            const actual = (component as any)._entitiesById;

            // Assert
            expect(actual).toHaveSize(1);
        });

        it("should clear persisted entities and alert failure when given invalid type", () => {
            // Arrange
            locationGatewayServiceMock.getLocation.and.returnValue(of(location));

            // Act
            component.findEntities("invalid");
            const actual = (component as any)._entitiesById;

            // Assert
            expect(actual).toHaveSize(0);
        });
    });
});
