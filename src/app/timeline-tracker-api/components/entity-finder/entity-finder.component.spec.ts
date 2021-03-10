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

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EntityFinderComponent],
            providers: [{
                    provide: LocationGatewayService, useValue: jasmine.createSpyObj("LocationGatewayService", ["getLocation"])
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

        it("should return the id and name of each retrieved location", () => {
            // Arrange
            (component as any)._locationIds = new Set<string>([locationData.id]);
            locationGatewayServiceMock.getLocation.and.returnValue(of(location));
            fixture.detectChanges();

            // Act
            const actual = component.locationNamesById;

            // Assert
            expect(actual.get(location.id)).toEqual(location.name);
        });

        it("should return in form supporting ReadonlyMap iteration", () => {
            // Arrange
            (component as any)._locationIds = new Set<string>([locationData.id]);
            locationGatewayServiceMock.getLocation.and.returnValue(of(location));
            fixture.detectChanges();

            // Act
            const actual = (component.locationNamesById as ReadonlyMap<string, string>);

            // Assert
            console.dir(actual);
            expect(actual).toHaveSize(1);
            expect(actual.get(location.id)).toEqual(location.name);
        });
    });
});
