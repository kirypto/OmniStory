import {ComponentFixture, TestBed} from "@angular/core/testing";

import {RangeScrollbarComponent} from "./range-scrollbar.component";

describe("RangeScrollbarComponent", () => {
    let component: RangeScrollbarComponent;
    let fixture: ComponentFixture<RangeScrollbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RangeScrollbarComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RangeScrollbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
