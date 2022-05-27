import {TestBed} from "@angular/core/testing";

import {AppConfigService} from "./app-config.service";
import {testingModuleDefinitions} from "../../../test-helpers.spec";

export const sampleApplicationConfig = {
    version: "TEST",
    ttapiConfiguration: {
        baseUrl: "fake.test.url:9999",
    },
};


describe("AppConfigService", () => {
    let service: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule(testingModuleDefinitions);
        service = TestBed.inject(AppConfigService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
