import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";

import {Location, LocationData} from "../entities/location";
import {constructEncodedQueryParams, handleError} from "./util";
import {LocationFilters} from "./filters";

@Injectable({
    providedIn: "root"
})
export class LocationGatewayService {
    // noinspection HttpUrlsUsage
    private _timelineTrackerApiUrl = "http://172.16.1.101:1337/api";

    constructor(
        private _httpClient: HttpClient,
    ) {
    }

    getLocation(locationId: string): Observable<Location | undefined> {
        return this._httpClient.get<LocationData>(`${this._timelineTrackerApiUrl}/location/${locationId}`)
            .pipe(
                tap(locationData => console.log(`Fetched ${locationData.id} Location`)),
                map((locationData: LocationData) => new Location(locationData as LocationData)),
                catchError(handleError<Location>(`getLocation(${locationId})`, undefined)),
            );
    }

    getLocationIds(filters?: LocationFilters): Observable<string[]> {
        const url = `${this._timelineTrackerApiUrl}/locations${constructEncodedQueryParams(filters)}`;
        return this._httpClient.get<string[]>(url)
            .pipe(
                tap(locationDataArr => console.log(`Fetched ${locationDataArr.length} Location Ids`)),
                catchError(handleError<string[]>("getLocationIds()", [])),
            );
    }
}
