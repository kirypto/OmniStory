import {Injectable} from "@angular/core";
import {Fetcher} from "openapi-typescript-fetch";

import {AppConfigService} from "../common/services/app-config/app-config.service";
import {paths} from "./schema";
import {from, Observable} from "rxjs";
import {handleError} from "./services/util";
import {catchError, tap, map, filter} from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class GatewayService {
    private _fetcher;

    private _getWorlds;

    constructor(
        appConfigService: AppConfigService,
    ) {
        this._fetcher = Fetcher.for<paths>();
        this._fetcher.configure({
            baseUrl: appConfigService.ttapiConfig.baseUrl,
            init: {
                headers: {},
            },
            use: [],
        });

        this._getWorlds = this._fetcher.path("/worlds").method("get").create();
    }


    public retrieveWorldIds(): Observable<string[]> {
        return from((async () => {
            const {status, data: pets} = await this._getWorlds();
            console.log(`Fetched ${pets}, status code ${status}`);
            return [status, pets];
        })()).pipe(
            tap(([statusCode, locationDataArr]) => console.log(`Fetched ${locationDataArr.length} Location Ids`)),
            // filter((statusCode, value) => statusCode === 200),
            map(([statusCode, value]) => value),
            catchError(handleError<string[]>("retrieveLocationIds()", [])),
        );
        // await this._getWorlds();
        // const url = `${this._timelineTrackerApiUrl}/locations${constructEncodedQueryParams(filters)}`;
        // return this._httpClient.get<string[]>(url)
        //     .pipe(
        //         tap(locationDataArr => console.log(`Fetched ${locationDataArr.length} Location Ids`)),
        //         catchError(handleError<string[]>("retrieveLocationIds()", [])),
        //     );
    }
}
