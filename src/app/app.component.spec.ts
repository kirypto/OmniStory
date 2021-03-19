import {TestBed} from "@angular/core/testing";

import {AppComponent} from "./app.component";
import {applicationDeclarations, applicationImports} from "./app.module";

describe("AppComponent", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: applicationImports,
            declarations: applicationDeclarations,
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
});
