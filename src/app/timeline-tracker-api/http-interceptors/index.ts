import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {JsonBareWordNumericSymbolTranslator} from "./json-infinity-translator.service";

/** All TTAPI http interceptor providers in outside-in order */
export const ttapiHttpInterceptorProviders = [
    {provide: HTTP_INTERCEPTORS, useClass: JsonBareWordNumericSymbolTranslator, multi: true},
];
