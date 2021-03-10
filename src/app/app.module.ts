import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";

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
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
