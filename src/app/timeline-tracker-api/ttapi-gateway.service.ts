import {Injectable} from "@angular/core";
import {Fetcher, Middleware, OpArgType, OpReturnType} from "openapi-typescript-fetch";

import {AppConfigService} from "../common/services/app-config/app-config.service";
import {paths} from "./ttapi-schema";
import {firstValueFrom, from, Observable} from "rxjs";
import {map} from "rxjs/operators";
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
            init.headers.set("Authorization", `Bearer ${await firstValueFrom(this.getAuthToken())}`);
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

        this._getWorlds = this._fetcher.path("/api/worlds").method("get").create();
    }

    public fetch<TPath extends keyof paths,
        TMethod extends keyof paths[TPath],
        TArgs extends OpArgType<paths[TPath][TMethod]>,
        TReturn extends OpReturnType<paths[TPath][TMethod]>>(
        path: TPath,
        method: TMethod,
        args: TArgs,
    ): Observable<TReturn> {
        return from((async () => {
            const fetcher = this._fetcher.path(path).method(method).create();
            const {status, data} = await fetcher(args);
            console.log(`Fetched ${data}, status code ${status}`);
            return data as TReturn;
        })());
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
