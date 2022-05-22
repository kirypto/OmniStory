import {ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {By} from "@angular/platform-browser";

import {EntitySearchComponent} from "./entity-search.component";
import {testingModuleDefinitions} from "../../../test-helpers.spec";


describe("EntityFinderComponent", () => {
    let component: EntitySearchComponent;
    let fixture: ComponentFixture<EntitySearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: testingModuleDefinitions.imports,
            declarations: testingModuleDefinitions.declarations,
            providers: [{
            }],
        }).compileComponents();
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

    describe("html and ui", () => {
        describe("entity filters", () => {
            it("should update input field in ui when class field modified", fakeAsync(() => {
                // Arrange
                const expectedFilterValue = "Foobar";
                // Set 'name is' because it is the first input field in the DOM hierarchy and thus found first
                component.advancedSearch = true;

                // Act
                component.filterNameIs = expectedFilterValue;
                const actual = getInputValue("div.filter input");

                // Assert
                expect(actual).toEqual(expectedFilterValue);
            }));

            it("should update field in class when text entered in ui", fakeAsync(() => {
                // Arrange
                component.advancedSearch = true;
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
