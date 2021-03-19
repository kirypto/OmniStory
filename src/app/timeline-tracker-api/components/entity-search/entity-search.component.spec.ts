import {ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {By} from "@angular/platform-browser";

import {of} from "rxjs";

import {EntitySearchComponent} from "./entity-search.component";
import {LocationGatewayService} from "../../gateways/location-gateway.service";
import {Location, LocationData} from "../../domain-types/location";
import {applicationDeclarations, applicationImports} from "../../../app.module";
import SpyObj = jasmine.SpyObj;


describe("EntityFinderComponent", () => {
    let component: EntitySearchComponent;
    let fixture: ComponentFixture<EntitySearchComponent>;
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
            imports: applicationImports,
            declarations: applicationDeclarations,
            providers: [{
                provide: LocationGatewayService, useValue: locationGatewaySpy
            }],
        }).compileComponents();
        locationGatewayServiceMock = TestBed.inject(LocationGatewayService) as SpyObj<LocationGatewayService>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EntitySearchComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        // Arrange
        // Act
        // Assert
        expect(component).toBeTruthy();
    });

    describe("class and methods", () => {

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

    describe("html and ui", () => {
        describe("entity filters", () => {
            it("should update input field in ui when class field modified", fakeAsync(() => {
                // Arrange
                const expectedFilterValue = "Foobar";
                // Set 'name is' because it is the first input field in the DOM hierarchy and thus found first
                if (!component.areFiltersVisible) { component.toggleFilterVisibility(); }

                // Act
                component.filterNameIs = expectedFilterValue;
                const actual = getInputValue("div.filter input");

                // Assert
                expect(actual).toEqual(expectedFilterValue);
            }));

            it("should update field in class when text entered in ui", fakeAsync(() => {
                // Arrange
                if (!component.areFiltersVisible) { component.toggleFilterVisibility(); }
                const expectedFilterValue = "Foobar";

                // Act
                setInputValue("div.filter input", expectedFilterValue);

                // Assert
                // Check 'name is' because it is the first input field in the DOM hierarchy and thus found first
                expect(component.filterNameIs).toEqual(expectedFilterValue);
            }));

            /**
             * Sets the value of the html input located with the given selector
             * (Must be called within fakeAsync due to use of tick)
             * @param selector CSS selector to locate html input
             * @param value text to set in the input
             */
            function setInputValue(selector: string, value: string): void {
                fixture.detectChanges();
                tick();

                const input = fixture.debugElement.query(By.css(selector)).nativeElement;
                input.value = value;
                input.dispatchEvent(new Event("input"));
                tick();
            }

            /**
             * Gets the value of the html input located with the given selector
             * (Must be called within fakeAsync due to use of tick)
             * @param selector CSS selector to locate html input
             */
            function getInputValue(selector: string): string {
                fixture.detectChanges();
                tick();

                const input = fixture.debugElement.query(By.css(selector)).nativeElement;
                return input.value;
            }
        });
    });
});
