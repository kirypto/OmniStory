import {HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";

import {applicationDeclarations, applicationImports} from "./app-index";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {APP_INITIALIZER, Provider} from "@angular/core";
import {AppConfigService} from "./common/services/app-config/app-config.service";
import {sampleApplicationConfig} from "./common/services/app-config/app-config.service.spec";


describe("Workaround to have this considered as a test only file", () => {
});


export const testingModuleDefinitions = {
    providers: getTestProviders(),
    imports: getTestImports(),
    declarations: applicationDeclarations,
};

function getTestImports(): any[] {
    const testImports = [...applicationImports];

    function replace(module: any, withModule: any): void {
        const moduleIndex = testImports.indexOf(module);
        if (moduleIndex === -1) {
            throw new Error("HttpClientModule not in application imports");
        }
        testImports.splice(moduleIndex, 1);
        testImports.push(withModule);
    }

    replace(HttpClientModule, HttpClientTestingModule);
    replace(BrowserAnimationsModule, NoopAnimationsModule);
    return testImports;
}

function getTestProviders(): Provider[] {
    return [
        {
            provide: APP_INITIALIZER, multi: true, deps: [AppConfigService],
            useFactory: (appConfigService: AppConfigService) => (() => (appConfigService as any).initialize(sampleApplicationConfig)),
        },
    ];
}
