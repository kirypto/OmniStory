import {TestBed} from "@angular/core/testing";

import {TtapiGatewayService} from "./ttapi-gateway.service";

describe("TtapiGatewayService", () => {
    let service: TtapiGatewayService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TtapiGatewayService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
