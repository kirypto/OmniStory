import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {APP_INITIALIZER, Provider} from "@angular/core";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatToolbarModule} from "@angular/material/toolbar";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule, Routes} from "@angular/router";

import {AppComponent} from "./app.component";
// import {ContinuumInputComponent} from "./common/components/continuum-input/continuum-input.component";
import {HomeComponent} from "./common/components/home/home.component";
import {NavbarOverlayComponent} from "./common/components/navbar-overlay/navbar-overlay.component";
import {NavbarComponent} from "./common/components/navbar/navbar.component";
import {NotFoundComponent} from "./common/components/not-found/not-found.component";
import {ScrollableContainerComponent} from "./common/components/scrollable-container/scrollable-container.component";
import {WorldCalendarComponent} from "./common/components/world-calendar/world-calendar.component";
import {AppConfigService} from "./common/services/app-config/app-config.service";
import {JsonBareWordNumericSymbolTranslator} from "./common/services/json-bare-word-numeric-symbol-translator.service";
import {RoutePaths} from "./common/types/route-paths";
import {EntitySearchComponent} from "./timeline-tracker-api/components/entity-search/entity-search.component";
import {LocationComponent} from "./timeline-tracker-api/components/location/location.component";

/**
 * All http interceptor providers in outside-in order
 */
const httpInterceptorProviders = [
    {provide: HTTP_INTERCEPTORS, useClass: JsonBareWordNumericSymbolTranslator, multi: true},
];

/**
 * App config provider, ensuring config is loaded before constructing any dependant classes
 */
const appConfigProvider: Provider = {
    provide: APP_INITIALIZER, multi: true, deps: [AppConfigService],
    useFactory: (appConfigService: AppConfigService) => (() => appConfigService.loadApplicationConfig()),
};

/**
 * All Application Providers
 */
export const applicationProviders: Provider[] = [
    httpInterceptorProviders,
    appConfigProvider,
    MatDatepickerModule,
];

/**
 * Primary routes used in the application, used in the Application Imports
 */
const routes: Routes = [
    {path: RoutePaths.home, component: HomeComponent},
    {path: RoutePaths.entitySearch, component: EntitySearchComponent},
    {path: RoutePaths.worldCalendar, component: WorldCalendarComponent},
    {path: RoutePaths.location_locationId, component: LocationComponent},
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
    MatInputModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forRoot(routes),
];

/**
 * All Application Declarations
 */
export const applicationDeclarations = [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    NavbarComponent,
    NavbarOverlayComponent,
    LocationComponent,
    EntitySearchComponent,
    WorldCalendarComponent,
    ScrollableContainerComponent,
    // ContinuumInputComponent,
];
