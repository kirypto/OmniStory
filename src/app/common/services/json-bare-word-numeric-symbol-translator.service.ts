import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";

import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class JsonBareWordNumericSymbolTranslator implements HttpInterceptor {
    private static infinityFlag = "__INFINITY_FLAG__";
    private static negInfinityFlag = "__NEG_INFINITY_FLAG__";
    private static nanFlag = "__NAN_FLAG__";

    private static replaceBareWordSymbolsWithFlags(body: string): string {
        const infinityBareWordPattern = /(": )Infinity(,?)/;
        const negInfinityBareWordPattern  = /(": )-Infinity(,?)/;
        const nanBareWordPattern  = /(": )NaN(,?)/;
        return body
            .replace(infinityBareWordPattern, `$1"${this.infinityFlag}"$2`)
            .replace(negInfinityBareWordPattern, `$1"${this.negInfinityFlag}"$2`)
            .replace(nanBareWordPattern, `$1"${this.nanFlag}"$2`);
    }

    private static translateJsonWithFlags(substitutedBody: string): any {
        return JSON.parse(substitutedBody, (key: string, value: string) => {
            if (value === this.infinityFlag) {
                return Infinity;
            } else if (value === this.negInfinityFlag) {
                return -Infinity;
            } else if (value === this.nanFlag) {
                return NaN;
            } else {
                return value;
            }
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.responseType !== "json") {
            // Do not modify requests with response types other than json
            return next.handle(req);
        }

        return next.handle(req.clone({responseType: "text"})).pipe(
            map((event) => {
                if (!(event instanceof HttpResponse)) {
                    return event;
                }

                const substitutedBody = JsonBareWordNumericSymbolTranslator.replaceBareWordSymbolsWithFlags(event.body);
                const parsedJson = JsonBareWordNumericSymbolTranslator.translateJsonWithFlags(substitutedBody);
                return event.clone({body: parsedJson});
            })
        );
    }
}
