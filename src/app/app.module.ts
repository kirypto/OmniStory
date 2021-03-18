import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

import {httpInterceptorProviders} from "./common/http-interceptors/interceptor-providers";
import {AppComponent} from "./app.component";
import {LocationComponent} from "./timeline-tracker-api/components/location/location.component";
import {EntityFinderComponent} from "./timeline-tracker-api/components/entity-finder/entity-finder.component";

@NgModule({
    declarations: [
        AppComponent,
        LocationComponent,
        EntityFinderComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
    ],
    providers: [
        httpInterceptorProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
