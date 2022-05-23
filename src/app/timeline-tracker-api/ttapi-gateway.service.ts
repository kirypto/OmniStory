import {Injectable} from "@angular/core";
import {Fetcher, Middleware} from "openapi-typescript-fetch";

import {AppConfigService} from "../common/services/app-config/app-config.service";
import {paths} from "./ttapi-schema";
import {from, Observable} from "rxjs";
import {handleError} from "./util";
import {catchError, map} from "rxjs/operators";
import {AuthService} from "@auth0/auth0-angular";
import {CustomRequestInit, Fetch} from "openapi-typescript-fetch/dist/cjs/types";

@Injectable({
    providedIn: "root",
})
export class TtapiGatewayService {
    private _fetcher;

    private readonly _getWorlds;

    constructor(
        private _authService: AuthService,
        appConfigService: AppConfigService,
    ) {
        this._fetcher = Fetcher.for<paths>();
        this._fetcher.configure({
            baseUrl: appConfigService.ttapiConfig.baseUrl,
            init: {
                headers: {},
            },
            use: [
                this.addAuthenticationTokenMiddleware,
            ],
        });

        this._getWorlds = this._fetcher.path("/worlds").method("get").create();
    }

    public retrieveWorldIds(): Observable<string[]> {
        return from((async () => {
            const {status, data: worldIds} = await this._getWorlds() as {status: number, data: string[]};
            console.log(`Fetched ${worldIds}, status code ${status}`);
            return worldIds;
        })()).pipe(
            catchError(handleError<string[]>("retrieveWorldIds()", [])),
        );
    }

    private getAuthToken(): Observable<string> {
        return this._authService.getIdTokenClaims().pipe(
            map(value => value.__raw),
        );
    }

    private addAuthenticationTokenMiddleware: Middleware = async (url: string, init: CustomRequestInit, next: Fetch) => {
        init.headers.set("Authorization", `Bearer ${await this.getAuthToken().toPromise()}`);
        return await next(url, init);
    }
}
