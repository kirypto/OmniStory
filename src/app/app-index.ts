import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {Provider} from "@angular/core";
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
import {AuthHttpInterceptor, AuthModule} from "@auth0/auth0-angular";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";

import {AppComponent} from "./app.component";
import {MapCanvasComponent} from "./common/components/map-canvas/map-canvas.component";
import {RangeScrollbarComponent} from "./common/components/range-scrollbar/range-scrollbar.component";
import {RoutePaths} from "./common/types/route-paths";
import {EntityComponent} from "./omni-story/primary-components/edit-entity/entity.component";
import {HomeComponent} from "./omni-story/primary-components/home/home.component";
import {MapComponent} from "./omni-story/primary-components/map/map.component";
import {NavbarOverlayComponent} from "./omni-story/primary-components/navbar-overlay/navbar-overlay.component";
import {NavbarComponent} from "./omni-story/primary-components/navbar/navbar.component";
import {NotFoundComponent} from "./omni-story/primary-components/not-found/not-found.component";
import {StoryComponent} from "./omni-story/primary-components/story/story.component";
import {auth0Config} from "../environments/environment";

/**
 * All http interceptor providers in outside-in order
 */
const httpInterceptorProviders = [
    {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true},
];

/**
 * All Application Providers
 */
export const applicationProviders: Provider[] = [
    httpInterceptorProviders,
    MatDatepickerModule,
];

/**
 * Primary routes used in the application, used in the Application Imports
 */
const routes: Routes = [
    {path: RoutePaths.home, component: HomeComponent},
    {path: RoutePaths.map, component: MapComponent},
    {path: RoutePaths.entity, component: EntityComponent},
    {path: RoutePaths.story, component: StoryComponent},
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
    MatInputModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DragDropModule,
    MatMenuModule,
    MatTooltipModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    AuthModule.forRoot(auth0Config),
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
    MapComponent,
    RangeScrollbarComponent,
    MapCanvasComponent,
    EntityComponent,
    StoryComponent
];
