import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {Subscription} from "rxjs";
import {catchError, map, mergeMap, tap} from "rxjs/operators";

import {RoutePaths} from "../../../common/types/route-paths";
import {Location, Metadata, Span, Tags} from "../../types/location";
import {LocationGatewayService} from "../../services/location-gateway.service";
import {handleError} from "../../services/util";

@Component({
    selector: "app-location",
    templateUrl: "./location.component.html",
    styleUrls: ["./location.component.css"]
})
export class LocationComponent implements OnInit, OnDestroy {
    private _isDataReady = false;
    private _locationRetrievalSubscription: Subscription;

    private _location: Location;
    public name: string;
    public description: string;
    public spanLatitudeLow: string;
    public spanLatitudeHigh: string;
    public spanLongitudeLow: string;
    public spanLongitudeHigh: string;
    public spanAltitudeLow: string;
    public spanAltitudeHigh: string;
    public spanContinuumLow: string;
    public spanContinuumHigh: string;
    public spanRealityLow: string;
    public spanRealityHigh: string;

    public constructor(
        private _locationGateway: LocationGatewayService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
    }

    public ngOnInit(): void {
        let locationIdParam = "";
        this._locationRetrievalSubscription = this._route.params
            .pipe(
                map((params) => params.locationId),
                tap((locationId: string) => locationIdParam = locationId),
                map((locationId: string) => this._locationGateway.getLocation(locationId)),
                mergeMap((locationObservable) => locationObservable),
                catchError(handleError<Location>(`404 during navigation to ${RoutePaths.location_locationId}`, undefined)),
            )
            .subscribe((location) => {
                if (location === undefined) {
                    this._router.navigateByUrl(`/not-found/${locationIdParam}`).then();
                    return;
                }
                this.initialize(location);
            });
    }

    private initialize(location: Location): void {
        this._location = location;
        this.name = location.name;
        this.description = location.description;
        this.spanLatitudeLow = location.span.latitude.low.toString();
        this.spanLatitudeHigh = location.span.latitude.high.toString();
        this.spanLongitudeLow = location.span.longitude.low.toString();
        this.spanLongitudeHigh = location.span.longitude.high.toString();
        this.spanAltitudeLow = location.span.altitude.low.toString();
        this.spanAltitudeHigh = location.span.altitude.high.toString();
        this.spanContinuumLow = location.span.continuum.low.toString();
        this.spanContinuumHigh = location.span.continuum.high.toString();
        this.spanRealityLow = location.span.reality.low.toString();
        this.spanRealityHigh = location.span.reality.high.toString();

        this._isDataReady = true;
    }

    public ngOnDestroy(): void {
        this._locationRetrievalSubscription.unsubscribe();
    }

    public get isDataReady(): boolean {
        return this._isDataReady;
    }

    public get span(): Span {
        return this._location.span;
    }

    public get tags(): Tags {
        return this._location.tags;
    }

    public get metadata(): Metadata {
        return this._location.metadata;
    }

    public get isDifferentFromData(): boolean {
        const spanLatitudeLowInt = parseInt(this.spanLatitudeLow, 10);
        const spanLatitudeHighInt = parseInt(this.spanLatitudeHigh, 10);
        const spanLongitudeLowInt = parseInt(this.spanLongitudeLow, 10);
        const spanLongitudeHighInt = parseInt(this.spanLongitudeHigh, 10);
        const spanAltitudeLowInt = parseInt(this.spanAltitudeLow, 10);
        const spanAltitudeHighInt = parseInt(this.spanAltitudeHigh, 10);
        const spanContinuumLowInt = parseInt(this.spanContinuumLow, 10);
        const spanContinuumHighInt = parseInt(this.spanContinuumHigh, 10);
        const spanRealityLowInt = parseInt(this.spanRealityLow, 10);
        const spanRealityHighInt = parseInt(this.spanRealityHigh, 10);

        // TODO add better validation: non-empty, NaN, etc
        const isValid = true;

        const isIdentical = this._location.name === this.name
            && this._location.description === this.description
            && this._location.span.latitude.low === spanLatitudeLowInt
            && this._location.span.latitude.high === spanLatitudeHighInt
            && this._location.span.longitude.low === spanLongitudeLowInt
            && this._location.span.longitude.high === spanLongitudeHighInt
            && this._location.span.altitude.low === spanAltitudeLowInt
            && this._location.span.altitude.high === spanAltitudeHighInt
            && this._location.span.continuum.low === spanContinuumLowInt
            && this._location.span.continuum.high === spanContinuumHighInt
            && this._location.span.reality.low === spanRealityLowInt
            && this._location.span.reality.high === spanRealityHighInt
        ;
        return isValid && !isIdentical;
    }
}
