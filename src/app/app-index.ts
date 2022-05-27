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
import {AuthHttpInterceptor} from "@auth0/auth0-angular";
import {DragDropModule} from "@angular/cdk/drag-drop";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./omni-story/primary-components/home/home.component";
import {NavbarOverlayComponent} from "./omni-story/primary-components/navbar-overlay/navbar-overlay.component";
import {NavbarComponent} from "./omni-story/primary-components/navbar/navbar.component";
import {NotFoundComponent} from "./omni-story/primary-components/not-found/not-found.component";
import {ScrollableContainerComponent} from "./common/components/scrollable-container/scrollable-container.component";
import {AppConfigService} from "./common/services/app-config/app-config.service";
import {JsonBareWordNumericSymbolTranslator} from "./common/services/json-bare-word-numeric-symbol-translator.service";
import {RoutePaths} from "./common/types/route-paths";
import {EntitySearchComponent} from "./omni-story/primary-components/entity-search/entity-search.component";
import {AuthModule} from "@auth0/auth0-angular";
import {MapComponent} from "./omni-story/primary-components/map/map.component";
import {RangeScrollbarComponent} from "./common/components/range-scrollbar/range-scrollbar.component";
import {MapCanvasComponent} from "./common/components/map-canvas/map-canvas.component";

/**
 * All http interceptor providers in outside-in order
 */
const httpInterceptorProviders = [
    {provide: HTTP_INTERCEPTORS, useClass: JsonBareWordNumericSymbolTranslator, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true},
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
    {path: RoutePaths.map, component: MapComponent},
    {path: "**", component: NotFoundComponent},
];

// noinspection SpellCheckingInspection
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
    DragDropModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    AuthModule.forRoot({
        domain: "dev-80z7621b.us.auth0.com",
        clientId: "I1aVHsO0Y92ecGY5TZGyTGIFinuUec2I",
        audience: "https://dev-80z7621b.us.auth0.com/api/v2/",
        scope: "read:current_user",
        httpInterceptor: {
            allowedList: [
                {
                    uri: "https://dev-80z7621b.us.auth0.com/api/v2/*", tokenOptions: {
                        audience: "https://dev-80z7621b.us.auth0.com/api/v2/",
                        scope: "read:current_user",
                    },
                },
            ],
        },
    }),
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
    EntitySearchComponent,
    ScrollableContainerComponent,
    MapComponent,
    RangeScrollbarComponent,
    MapCanvasComponent,
];
