import {ComponentFixture, TestBed} from "@angular/core/testing";

import {NavbarOverlayComponent} from "./navbar-overlay.component";

describe("NavbarOverlayComponent", () => {
    let component: NavbarOverlayComponent;
    let fixture: ComponentFixture<NavbarOverlayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavbarOverlayComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarOverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
