import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JsonBareWordNumericSymbolTranslator} from "./common/services/json-bare-word-numeric-symbol-translator.service";
import {AppComponent} from "./app.component";
import {MainComponent} from "./common/components/main/main.component";
import {NotFoundComponent} from "./common/components/not-found/not-found.component";
import {LocationComponent} from "./timeline-tracker-api/components/location/location.component";
import {EntitySearchComponent} from "./timeline-tracker-api/components/entity-search/entity-search.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {RoutePaths} from "./common/types/route-paths";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FlexLayoutModule} from "@angular/flex-layout";

/**
 * All http interceptor providers in outside-in order
 */
const httpInterceptorProviders = [
    {provide: HTTP_INTERCEPTORS, useClass: JsonBareWordNumericSymbolTranslator, multi: true},
];

/**
 * All Application Providers
 */
export const applicationProviders = [
    httpInterceptorProviders,
];

/**
 * Primary routes used in the application, used in the Application Imports
 */
const routes: Routes = [
    {path: RoutePaths.main, component: MainComponent},
    {path: RoutePaths.entitySearch, component: EntitySearchComponent},
    {path: "**", component: NotFoundComponent},
];

/**
 * All Application Imports
 */
export const applicationImports = [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    RouterModule.forRoot(routes),
];

/**
 * All Application Declarations
 */
export const applicationDeclarations = [
    AppComponent,
    MainComponent,
    NotFoundComponent,
    LocationComponent,
    EntitySearchComponent,
];
