import {ComponentFixture, TestBed} from "@angular/core/testing";

import {LocationComponent} from "./location.component";
import {Location, LocationData} from "../../types/location";
import {applicationDeclarations, applicationImports} from "../../../app-index";

describe("LocationComponent", () => {
    let component: LocationComponent;
    let fixture: ComponentFixture<LocationComponent>;
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
    const sampleLocation: Location = new Location(locationData);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: applicationImports,
            declarations: applicationDeclarations
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LocationComponent);
        component = fixture.componentInstance;
    });

    describe("Component Initialization", () => {
        it("should create", () => {
            // Arrange
            (component as any)._location = sampleLocation;
            fixture.detectChanges();

            // Act
            // Assert
            expect(component).toBeTruthy();
        });

        it("should have expected attributes", () => {
            // Arrange
            (component as any)._location = sampleLocation;
            fixture.detectChanges();

            // Act
            // Assert
            expect(component.id).toBe(sampleLocation.id);
            expect(component.name).toBe(sampleLocation.name);
            expect(component.description).toBe(sampleLocation.description);
            expect(component.span).toBe(sampleLocation.span);
            expect(component.tags).toBe(sampleLocation.tags);
            expect(component.metadata).toBe(sampleLocation.metadata);
        });
    });
});
