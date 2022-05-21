import {Injectable} from "@angular/core";
import {Fetcher, Middleware} from "openapi-typescript-fetch";

import {AppConfigService} from "../common/services/app-config/app-config.service";
import {paths} from "./schema";
import {Observable} from "rxjs";
import {handleError} from "./services/util";
import {catchError, map, switchMap} from "rxjs/operators";
import {AuthService} from "@auth0/auth0-angular";
import {CustomRequestInit, Fetch} from "openapi-typescript-fetch/dist/cjs/types";

@Injectable({
    providedIn: "root",
})
export class GatewayService {
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
                this.authenticationMiddleware,
            ],
        });

        this._getWorlds = this._fetcher.path("/worlds").method("get").create();
    }

    public retrieveWorldIds(): Observable<string[]> {
        return this.getAuthToken().pipe(
            switchMap(async authToken => {
                const {statusCode, data: ids} = await this._getWorlds() as { statusCode: number, data: string[] };
                console.log(`Fetched ${ids}, statusCode code ${statusCode}`);
                return ids;
            }),
            catchError(handleError<string[]>("retrieveWorldIds()", [])),
            // map(([statusCode: number, ids: string[]]) => ids),
        );
        // return from((async () => {
        //     const {status, data: pets} = await this._getWorlds();
        //     console.log(`Fetched ${pets}, status code ${status}`);
        //     return [status, pets];
        // })()).pipe(
        //     tap(([statusCode, locationDataArr]) => console.log(`Fetched ${locationDataArr.length} Location Ids`)),
        //     // filter((statusCode, value) => statusCode === 200),
        //     map(([statusCode, value]) => value),
        // );
        // await this._getWorlds();
        // const url = `${this._timelineTrackerApiUrl}/locations${constructEncodedQueryParams(filters)}`;
        // return this._httpClient.get<string[]>(url)
        //     .pipe(
        //         tap(locationDataArr => console.log(`Fetched ${locationDataArr.length} Location Ids`)),
        //         catchError(handleError<string[]>("retrieveLocationIds()", [])),
        //     );
    }

    private getAuthToken(): Observable<string> {
        return this._authService.getIdTokenClaims().pipe(
            map(value => value.__raw),
        );
        // return from((async () => {
        //     const claims = await this._authService.getIdTokenClaims();
        //     return claims;
        // })());
    }

    private authenticationMiddleware: Middleware = async (url: string, init: CustomRequestInit, next: Fetch) => {
        init.headers.set("Authorization", `Bearer ${await this.getAuthToken().toPromise()}`);
        console.log(`fetching ${url} with headers ${init.headers}`);
        const response = await next(url, init);
        console.log(`fetched ${url}`);
        return response;
    }
}
