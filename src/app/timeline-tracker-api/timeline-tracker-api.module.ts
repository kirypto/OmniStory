import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TtapiGateway} from "@ttapi/domain/ttapi-gateway.model";
import {TtapiGatewayService} from "@ttapi/adapter/ttapi-gateway.service";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
    providers: [
        {provide: TtapiGateway, useClass: TtapiGatewayService}
    ]
})
export class TimelineTrackerApiModule {
}
