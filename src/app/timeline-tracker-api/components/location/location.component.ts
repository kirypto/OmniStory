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
    private _name: string;
    private _description: string;

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
        this._name = location.name;
        this._description = location.description;
        this._isDataReady = true;

    }

    public ngOnDestroy(): void {
        this._locationRetrievalSubscription.unsubscribe();
    }

    public get isDataReady(): boolean {
        return this._isDataReady;
    }

    public get id(): string {
        return this._location.id;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get description(): string {
        return this._location.description;
    }

    public set description(value: string) {
        this._description = value;
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
        return this._location.name !== this._name.trim()
            || this._location.description !== this._description.trim();
    }
}
