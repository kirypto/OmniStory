import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";

import {AppComponent} from "./app.component";

import {httpInterceptorProviders} from "./common/http-interceptors/interceptor-providers";
import {NotFoundComponent} from "./common/components/not-found/not-found.component";
import {MainComponent} from "./common/components/main/main.component";

import {LocationComponent} from "./timeline-tracker-api/components/location/location.component";
import {EntitySearchComponent} from "./timeline-tracker-api/components/entity-search/entity-search.component";


enum RoutePaths {
    main = "",
    entitySearch = "entity-search",
}

const routes: Routes = [
    {path: RoutePaths.main, component: MainComponent},
    {path: RoutePaths.entitySearch, component: EntitySearchComponent},
    {path: "**", component: NotFoundComponent},
];

export const applicationDeclarations = [
    AppComponent,
    MainComponent,
    NotFoundComponent,
    LocationComponent,
    EntitySearchComponent,
];

export const applicationImports = [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
];

@NgModule({
    declarations: applicationDeclarations,
    imports: applicationImports,
    providers: [
        httpInterceptorProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
