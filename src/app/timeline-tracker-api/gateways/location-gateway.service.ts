import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Location, LocationData} from "../entities/location";
import {catchError, map, tap} from "rxjs/operators";
import {handleError} from "./util";

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

    getLocationIds(): Observable<string[]> {
        return this._httpClient.get<string[]>(`${this._timelineTrackerApiUrl}/locations`)
            .pipe(
                tap(locationDataArr => console.log(`Fetched ${locationDataArr.length} Location Ids`)),
                catchError(handleError<string[]>("getLocationIds()", [])),
            );
    }
}
