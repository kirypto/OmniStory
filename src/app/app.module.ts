import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {applicationDeclarations, applicationImports, applicationProviders} from "./app-index";


@NgModule({
    declarations: applicationDeclarations,
    imports: applicationImports,
    providers: applicationProviders,
    bootstrap: [AppComponent]
})
export class AppModule {}
