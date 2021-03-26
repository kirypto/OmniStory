import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {Subscription} from "rxjs";
import {catchError, map, mergeMap, tap} from "rxjs/operators";

import {RoutePaths} from "../../../common/types/route-paths";
import {Location} from "../../types/location";
import {LocationGatewayService} from "../../services/location-gateway.service";
import {handleError} from "../../services/util";

@Component({
    selector: "app-location",
    templateUrl: "./location.component.html",
    styleUrls: ["./location.component.scss"]
})
export class LocationComponent implements OnInit, OnDestroy {
    private _isDataReady = false;
    private _allowedToDeleteTag = true;
    private _allowedToDeleteMetadata = true;

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
    public metadataList: [string, string][];
    public tagList: string[];

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
    }

    public ngOnDestroy(): void {
        this._locationRetrievalSubscription.unsubscribe();
    }

    public get isDataReady(): boolean {
        return this._isDataReady;
    }

    public insertNewMetadata(): void {
        this.metadataList.push(["key", "value"]);
    }

    public deleteMetadata(metadataPair: [string, string]): void {
        const index = this.metadataList.indexOf(metadataPair);
        this.metadataList.splice(index, 1);
    }

    public get isAllowedToDeleteMetadata(): boolean {
        return this._allowedToDeleteMetadata;
    }

    public sortMetadata(): void {
        this._allowedToDeleteMetadata = false;
        this.metadataList.sort(([aKey]: [string, string], [bKey]: [string, string]) => {
            return aKey.localeCompare(bKey);
        });
        setTimeout(() => this._allowedToDeleteMetadata = true, 25);
    }

    public insertNewTag(): void {
        this.tagList.push("tag");
    }

    public deleteTag(tag: string): void {
        const index = this.tagList.indexOf(tag);
        this.tagList.splice(index, 1);
    }

    public get isAllowedToDeleteTag(): boolean {
        return this._allowedToDeleteTag;
    }

    public sortTags(): void {
        this._allowedToDeleteTag = false;
        this.tagList.sort((tagA: string, tagB: string) => {
            return tagA.localeCompare(tagB);
        });
        setTimeout(() => this._allowedToDeleteTag = true, 25);
    }

    public identifyTag(index: number, _tag: string): number {
        // Identify using the index so that Angular does not re-render mid typing causing focus loss after each character change
        return index;
    }

    public get isDifferentFromPersistedLocation(): boolean {
        const metadataObj: { [key: string]: string } = {};
        for (const [key, value] of this.metadataList) {
            metadataObj[key] = value;
        }
        const locationData = {
            id: this._location.id,
            name: this.name,
            description: this.description,
            span: {
                latitude: {low: parseFloat(this.spanLatitudeLow), high: parseFloat(this.spanLatitudeHigh)},
                longitude: {low: parseFloat(this.spanLongitudeLow), high: parseFloat(this.spanLongitudeHigh)},
                altitude: {low: parseFloat(this.spanAltitudeLow), high: parseFloat(this.spanAltitudeHigh)},
                continuum: {low: parseFloat(this.spanContinuumLow), high: parseFloat(this.spanContinuumHigh)},
                reality: {low: parseFloat(this.spanRealityLow), high: parseFloat(this.spanRealityHigh)},
            },
            tags: [...this._location.tags],
            metadata: metadataObj,
        };

        // TODO add better validation: non-empty, NaN, etc
        const isValid = true;

        const isIdentical = this._location.equals(new Location(locationData));
        return isValid && !isIdentical;
    }
}
