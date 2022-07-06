import {Injectable} from "@angular/core";
import {Fetcher, Middleware} from "openapi-typescript-fetch";

import {AppConfigService} from "../common/services/app-config/app-config.service";
import {paths} from "./ttapi-schema";
import {from, Observable} from "rxjs";
import {handleError} from "../common/util";
import {catchError, map} from "rxjs/operators";
import {AuthService} from "@auth0/auth0-angular";
import {CustomRequestInit, Fetch} from "openapi-typescript-fetch/dist/cjs/types";
import {WorldIds} from "./ttapi-types";

@Injectable({
    providedIn: "root",
})
export class TtapiGatewayService {
    private _fetcher;

    private readonly _getWorlds: () => Promise<{ status: number; data: WorldIds }>;

    constructor(
        private _authService: AuthService,
        appConfigService: AppConfigService,
    ) {
        const addAuthenticationTokenMiddleware: Middleware = async (url: string, init: CustomRequestInit, next: Fetch) => {
            init.headers.set("Authorization", `Bearer ${await this.getAuthToken().toPromise()}`);
            return await next(url, init);
        };
        this._fetcher = Fetcher.for<paths>();
        this._fetcher.configure({
            baseUrl: appConfigService.ttapiConfig.baseUrl,
            init: {
                headers: {},
            },
            use: [
                addAuthenticationTokenMiddleware,
            ],
        });

        this._getWorlds = this._fetcher.path("/worlds").method("get").create();
    }

    public retrieveWorldIds(): Observable<WorldIds> {
        return from((async () => {
            const {status, data: worldIds} = await this._getWorlds();
            console.log(`Fetched ${worldIds}, status code ${status}`);
            return worldIds;
        })()).pipe(
            catchError(handleError<WorldIds>("retrieveWorldIds()", [])),
        );
    }

    private getAuthToken(): Observable<string> {
        return this._authService.getIdTokenClaims().pipe(
            map(value => {
                if (value === null || value === undefined) {
                    throw new Error("Not logged in!");
                }
                return value.__raw;
            }),
        );
    }
}
