import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {Subscription} from "rxjs";
import {catchError, map, mergeMap, tap} from "rxjs/operators";

import {RoutePaths} from "../../../common/types/route-paths";
import {Location, LocationData} from "../../types/location";
import {LocationGatewayService} from "../../services/location-gateway.service";
import {handleError} from "../../services/util";

@Component({
    selector: "app-location",
    templateUrl: "./location.component.html",
    styleUrls: ["./location.component.scss"]
})
export class LocationComponent implements OnInit, OnDestroy {
    private static _DELETION_DELAY_MS = 750;

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
    public spanRealities: number[];
    public metadataList: [string, string][];
    public tagList: string[];

    private _location: Location;
    private _locationRetrievalSubscription: Subscription;
    private _isDataReady = false;
    private _lastDataChange = new Date();

    public constructor(
        private _locationGateway: LocationGatewayService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
    }

    public get isDataReady(): boolean {
        return this._isDataReady;
    }

    public get isDifferentFromPersistedLocation(): boolean {
        const locationData = this.constructLocationData();

        // TODO add better validation: non-empty, NaN, etc
        const isValid = true;

        const isIdentical = this._location.equals(new Location(locationData));
        return isValid && !isIdentical;
    }

    public ngOnInit(): void {
        let locationIdParam = "";
        this._locationRetrievalSubscription = this._route.params
            .pipe(
                map((params) => params.locationId),
                tap((locationId: string) => locationIdParam = locationId),
                map((locationId: string) => this._locationGateway.retrieveLocation(locationId)),
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

    public ngOnDestroy(): void {
        this._locationRetrievalSubscription.unsubscribe();
    }

    public insertNewMetadata(): void {
        this.metadataList.push(["key", "value"]);
    }

    public deleteMetadata(metadataPair: [string, string]): void {
        if (this.isDeletionFrozen()) {
            console.warn("Deletion is frozen due to resent data change (likely a sort), aborting delete.");
            return;
        }

        const index = this.metadataList.indexOf(metadataPair);
        this.metadataList.splice(index, 1);
    }

    public sortMetadata(): void {
        let changedOrder = false;
        this.metadataList.sort(([aKey]: [string, string], [bKey]: [string, string]) => {
            const comparison = aKey.localeCompare(bKey);
            if (comparison < 0) { changedOrder = true; }
            return comparison;
        });

        if (changedOrder) {
            this._lastDataChange = new Date();
        }
    }

    public insertNewTag(): void {
        this.tagList.push("tag");
    }

    public deleteTag(tag: string): void {
        if (this.isDeletionFrozen()) {
            console.warn("Deletion is frozen due to resent data change (likely a sort), aborting delete.");
            return;
        }

        const index = this.tagList.indexOf(tag);
        this.tagList.splice(index, 1);
    }

    public sortTags(): void {
        let changedOrder = false;
        this.tagList.sort((tagA: string, tagB: string) => {
            const comparison = tagA.localeCompare(tagB);
            if (comparison < 0) { changedOrder = true; }
            return comparison;
        });

        if (changedOrder) {
            this._lastDataChange = new Date();
        }
    }

    public identifyTag(index: number, _tag: string): number {
        // Identify using the index so that Angular does not re-render mid typing causing focus loss after each character change
        return index;
    }

    public sortRealities(): void {
        let changed = false;
        this.spanRealities.sort((reality1: number, reality2: number) => {
            const comparison = reality1 - reality2;
            if (comparison < 0) { changed = true; }
            return comparison;
        });

        if (changed) {
            this._lastDataChange = new Date();
        }
    }

    public identifyReality(index: number, _reality: number): number {
        // Identify using the index so that Angular does not re-render mid typing causing focus loss after each character change
        return index;
    }

    public insertNewReality(): void {
        const highestReality = this.spanRealities[this.spanRealities.length - 1];
        this.spanRealities.push(highestReality + 1);
    }

    public save(): void {
        this._isDataReady = false;
        this._locationGateway.updateLocation(new Location(this.constructLocationData()))
            .pipe(
                map((location: Location) => this.initialize(location))
            )
            .subscribe();
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
        this.spanRealities = [];
        for (const reality of location.span.reality) {
            this.spanRealities.push(reality);
        }
        this.sortRealities();
        this.metadataList = [];
        for (const [key, val] of location.metadata.entries()) {
            this.metadataList.push([key, val]);
        }
        this.sortMetadata();
        this.tagList = [];
        for (const tag of location.tags) {
            this.tagList.push(tag);
        }
        this.sortTags();

        this._isDataReady = true;
        this._lastDataChange = new Date();
    }

    private isDeletionFrozen(): boolean {
        const millisSinceLastChange = new Date().getTime() - this._lastDataChange.getTime();
        return millisSinceLastChange < LocationComponent._DELETION_DELAY_MS;
    }

    private constructLocationData(): LocationData {
        const metadataObj: { [key: string]: string } = {};
        for (const [key, value] of this.metadataList) {
            metadataObj[key] = value;
        }
        return {
            id: this._location.id,
            name: this.name,
            description: this.description,
            span: {
                latitude: {low: parseFloat(this.spanLatitudeLow), high: parseFloat(this.spanLatitudeHigh)},
                longitude: {low: parseFloat(this.spanLongitudeLow), high: parseFloat(this.spanLongitudeHigh)},
                altitude: {low: parseFloat(this.spanAltitudeLow), high: parseFloat(this.spanAltitudeHigh)},
                continuum: {low: parseFloat(this.spanContinuumLow), high: parseFloat(this.spanContinuumHigh)},
                reality: [...this.spanRealities],
            },
            tags: [...this.tagList],
            metadata: metadataObj,
        };
    }
}
