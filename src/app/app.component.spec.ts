import {TestBed} from "@angular/core/testing";
import {AppComponent} from "./app.component";

describe("AppComponent", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
        }).compileComponents();
    });

    it("should create the app", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'Timeline Tracker UI'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual("Timeline Tracker UI");
    });

    it("should render greeting", () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector("#hello").textContent).toContain("Hello, Timeline Tracker UI!");
    });
});
