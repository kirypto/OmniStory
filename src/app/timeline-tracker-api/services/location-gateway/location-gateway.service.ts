import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, filter, map, mergeMap, tap} from "rxjs/operators";
import {createPatch} from "rfc6902";

import {Location, LocationData} from "../../types/location";
import {constructEncodedQueryParams, handleError} from "../util";
import {LocationFilters} from "../filters";
import {AppConfigService} from "../../../common/services/app-config/app-config.service";

@Injectable({
    providedIn: "root"
})
export class LocationGatewayService {
    // noinspection HttpUrlsUsage
    private readonly _timelineTrackerApiUrl;

    constructor(
        private _httpClient: HttpClient,
        private _appConfigService: AppConfigService,
    ) {
        this._timelineTrackerApiUrl = this._appConfigService.TtapiConfig.baseUrl;
    }

    public retrieveLocation(locationId: string): Observable<Location | undefined> {
        return this._httpClient.get<LocationData>(`${this._timelineTrackerApiUrl}/location/${locationId}`)
            .pipe(
                tap(locationData => console.log(`Fetched Location ${locationData.id}`)),
                map((locationData: LocationData) => new Location(locationData as LocationData)),
                catchError(handleError<Location>(`retrieveLocation(${locationId})`, undefined)),
            );
    }

    public retrieveLocationIds(filters?: LocationFilters): Observable<string[]> {
        const url = `${this._timelineTrackerApiUrl}/locations${constructEncodedQueryParams(filters)}`;
        return this._httpClient.get<string[]>(url)
            .pipe(
                tap(locationDataArr => console.log(`Fetched ${locationDataArr.length} Location Ids`)),
                catchError(handleError<string[]>("retrieveLocationIds()", [])),
            );
    }

    public updateLocation(location: Location): Observable<Location> {
        return this.retrieveLocation(location.id).pipe(
            filter((retrievedLocation: Location | undefined) => retrievedLocation !== undefined),
            map((retrievedLocation: Location) => {
                return createPatch(retrievedLocation.getData(), location.getData());
            }),
            map((jsonPatchOperations: object[]) => {
                const url = `${this._timelineTrackerApiUrl}/location/${location.id}`;
                const httpHeaders = new HttpHeaders().set("Content-Type", "application/json");
                return this._httpClient.patch<LocationData>(url, JSON.stringify(jsonPatchOperations, null, 2),
                    {headers: httpHeaders});
            }),
            mergeMap(observablePipe => observablePipe),
            map((locationData: LocationData) => new Location(locationData as LocationData)),
            tap(locationData => console.log(`Updated Location ${locationData.id}`)),
            catchError(handleError<Location>(`updateLocation(${location.id})`, location)),
        );
    }
}
