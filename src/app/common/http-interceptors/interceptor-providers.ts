import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {JsonBareWordNumericSymbolTranslator} from "./json-bare-word-numeric-symbol-translator.service";

/** All http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
    {provide: HTTP_INTERCEPTORS, useClass: JsonBareWordNumericSymbolTranslator, multi: true},
];
