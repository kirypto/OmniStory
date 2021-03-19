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
import {EntityFinderComponent} from "./timeline-tracker-api/components/entity-finder/entity-finder.component";


export enum RoutePaths {
    main = "",
    entityFinder = "entity-finder",
}

const routes: Routes = [
    {path: RoutePaths.main, component: MainComponent},
    {path: RoutePaths.entityFinder, component: EntityFinderComponent},
    {path: "**", component: NotFoundComponent},
];

export const applicationDeclarations = [
    AppComponent,
    LocationComponent,
    EntityFinderComponent,
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
