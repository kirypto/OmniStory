import {HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";

import {applicationImports} from "./app-index";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {APP_INITIALIZER, Provider} from "@angular/core";
import {AppConfigService} from "./common/services/app-config/app-config.service";
import {sampleApplicationConfig} from "./common/services/app-config/app-config.service.spec";


describe("Workaround to have this considered as a test only file", () => {
});

export function getTestProviders(): Provider[] {
    return [
        {
            provide: APP_INITIALIZER, multi: true, deps: [AppConfigService],
            useFactory: (appConfigService: AppConfigService) => (() => (appConfigService as any).initialize(sampleApplicationConfig)),
        },
    ];
}


export function getTestImports(): any[] {
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

export function deepCopy<T>(obj: T): T {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null === obj || undefined === obj || "object" !== typeof obj) { return obj; }

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (const attr in obj) {
            if (obj.hasOwnProperty(attr)) { copy[attr] = deepCopy(obj[attr]); }
        }
        return copy;
    }

    throw new Error(`Unable to copy obj! Its type '${typeof obj}' isn't supported.`);
}
