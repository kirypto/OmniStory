import {ComponentFixture, TestBed} from "@angular/core/testing";

import {ContinuumInputComponent} from "./continuum-input.component";

describe("ContinuumInputComponent", () => {
    let component: ContinuumInputComponent;
    let fixture: ComponentFixture<ContinuumInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContinuumInputComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContinuumInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
