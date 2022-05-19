import {ComponentFixture, TestBed} from "@angular/core/testing";

import {WorldCalendarComponent} from "./world-calendar.component";

describe("WorldCalendarComponent", () => {
    let component: WorldCalendarComponent;
    let fixture: ComponentFixture<WorldCalendarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WorldCalendarComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WorldCalendarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
