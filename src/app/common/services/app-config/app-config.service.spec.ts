import {TestBed} from "@angular/core/testing";

import {AppConfigService} from "./app-config.service";
import {getTestImports} from "../../../test-helpers.spec";

export const sampleApplicationConfig = {
    version: "TEST",
    ttapiBaseUrl: "fake.test.url:9999",
};


describe("AppConfigService", () => {
    let service: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: getTestImports(),
        });
        service = TestBed.inject(AppConfigService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
