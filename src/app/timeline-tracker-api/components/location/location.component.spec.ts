import {ComponentFixture, TestBed} from "@angular/core/testing";

import {LocationComponent} from "./location.component";
import {Location} from "../../types/location";
import {applicationDeclarations} from "../../../app-index";
import {sampleLocationData} from "../../types/location.spec";
import {getTestImports, getTestProviders} from "../../../test-helpers.spec";

describe("LocationComponent", () => {
    let component: LocationComponent;
    let fixture: ComponentFixture<LocationComponent>;
    const sampleLocation: Location = new Location(sampleLocationData);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: getTestImports(),
            declarations: applicationDeclarations,
            providers: getTestProviders(),
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
            (component as any).initialize(sampleLocation);
            fixture.detectChanges();

            // Act
            // Assert
            expect(component.name).toBe(sampleLocation.name);
            expect(component.description).toBe(sampleLocation.description);
        });
    });
});
