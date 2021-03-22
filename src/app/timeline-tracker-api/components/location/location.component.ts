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
    private _routeSubscription: Subscription;
    private _location: Location;

    constructor(
        private _locationGateway: LocationGatewayService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
    }

    ngOnInit(): void {
        let locationIdParam = "";
        this._routeSubscription = this._route.params
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
                }
                this._location = location;
            });
    }

    ngOnDestroy(): void {
        this._routeSubscription.unsubscribe();
    }

    get id(): string {
        return this._location.id;
    }

    get name(): string {
        return this._location.name;
    }

    get description(): string {
        return this._location.description;
    }

    get span(): Span {
        return this._location.span;
    }

    get tags(): Tags {
        return this._location.tags;
    }

    get metadata(): Metadata {
        return this._location.metadata;
    }
}
