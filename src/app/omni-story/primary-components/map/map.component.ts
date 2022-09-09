import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {NumericRange, shiftRangeByDelta, sizeOf, zoomRangeByDelta} from "../../../common/numeric-range";
import {
    CanvasAspectRatio,
    MapArea,
    MapCanvasComponent,
    MapContextMenuEvent,
    MapImage,
    MapLabel,
    PanEvent,
    ZoomEvent,
} from "../../../common/components/map-canvas/map-canvas.component";
import {ImageFetcherService} from "../../../common/services/image-fetcher.service";
import {deepCopy} from "../../../common/util";
import {ActivatedRoute} from "@angular/router";
import {Location, LocationId, LocationIds, WorldId} from "../../../timeline-tracker-api/ttapi-types";
import {SubscribingComponent} from "../../../common/components/SubscribingComponent";
import {TtapiGatewayService} from "../../../timeline-tracker-api/ttapi-gateway.service";
import {filter, mergeMap, take} from "rxjs/operators";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";
import {fromEvent, Subscription} from "rxjs";


interface MapItem extends MapImage {
    altitude: NumericRange;
    name: string;
    id: string;
}

function bestFitForAspectRatio(desiredArea: MapArea, requiredAspectRatio: CanvasAspectRatio): MapArea {
    const bestFitArea = deepCopy(desiredArea);
    const desiredLatitudeSize = desiredArea.latitude.high - desiredArea.latitude.low;
    const desiredLongitudeSize = desiredArea.longitude.high - desiredArea.longitude.low;
    const desiredLatUnitsPerLon = desiredLatitudeSize / desiredLongitudeSize;
    const needsHorizontalPadding = desiredLatUnitsPerLon > requiredAspectRatio.latUnitsPerLonUnit;
    if (needsHorizontalPadding) {
        // Need to pad desired area horizontally to match aspect ratio
        const necessaryLongitudeSize = requiredAspectRatio.lonUnitsPerLatUnit * desiredLatitudeSize;
        const necessaryLongitudePadding = necessaryLongitudeSize - desiredLongitudeSize;
        bestFitArea.longitude.low -= necessaryLongitudePadding / 2;
        bestFitArea.longitude.high += necessaryLongitudePadding / 2;
    } else {
        // Need to pad desired area vertically to match aspect ratio
        const necessaryLatitudeSize = requiredAspectRatio.latUnitsPerLonUnit * desiredLongitudeSize;
        const necessaryLatitudePadding = necessaryLatitudeSize - desiredLatitudeSize;
        bestFitArea.latitude.low -= necessaryLatitudePadding / 2;
        bestFitArea.latitude.high += necessaryLatitudePadding / 2;
    }
    return bestFitArea;
}

function clamp(desiredRange: NumericRange, limits: NumericRange): NumericRange {
    return {
        low: Math.max(desiredRange.low, limits.low),
        high: Math.min(desiredRange.high, limits.high),
    };
}

@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"],
})
export class MapComponent extends SubscribingComponent implements AfterViewInit, OnInit {
    @ViewChild(MapCanvasComponent) private _mapCanvas: MapCanvasComponent;
    @ViewChild("mapContextMenu") private _mapContextMenu: TemplateRef<{ $implicit: { latitude: number, longitude: number } }>;
    private _worldId: WorldId;
    private _overlayRef: OverlayRef;
    private _contextMenuSubscription: Subscription;

    private _latitude: NumericRange = {low: 0, high: 1};
    private _latitudeLimits: NumericRange = {low: 0, high: 1};
    private _longitude: NumericRange = {low: 0, high: 1};
    private _longitudeLimits: NumericRange = {low: 0, high: 1};
    private _altitude: NumericRange = {low: 25, high: 75};
    private _continuum: NumericRange = {low: 25, high: 75};

    private _mapImages: Set<MapItem> = new Set<MapItem>();

    public constructor(
        private _imageFetcher: ImageFetcherService,
        private _route: ActivatedRoute,
        private _ttapiGateway: TtapiGatewayService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
    ) {
        super();
    }

    public get selections(): string {
        return JSON.stringify({
            latitude: this._latitude,
            longitude: this._longitude,
            altitude: this._altitude,
            continuum: this._continuum,
        }, null, 4);
    }

    public ngOnInit(): void {
        this._worldId = this._route.snapshot.paramMap.get("worldId");
        this.newSubscription = this._ttapiGateway.fetch("/api/world/{worldId}/locations", "get", {
            worldId: this._worldId,
        }).pipe(
            mergeMap((locationIds: LocationIds) => locationIds),
            mergeMap((locationId: LocationId) => this._ttapiGateway.fetch("/api/world/{worldId}/location/{locationId}", "get", {
                worldId: this._worldId,
                locationId,
            })),
            // TODO kirypto 2022-Sep-09: Handle displaying locations that don't have an associated image.
            filter((location: Location) => !!location.attributes.sourceImageHD),
            mergeMap((location: Location) => {
                const sourceImageUrl = location.attributes.sourceImageHD as string;
                const promise: Promise<MapItem> = this._imageFetcher.fetchImage(sourceImageUrl).then(sourceImage => {
                    const mapItem: MapItem = {
                        latitude: location.span.latitude,
                        longitude: location.span.longitude,
                        altitude: location.span.altitude,
                        source: sourceImage,
                        name: location.name,
                        id: location.id,
                    };
                    return mapItem;
                });
                return promise;
            }),
        ).subscribe((locationAsMapItem: MapItem) => {
            this.addMapImage(locationAsMapItem);
        });
    }

    public ngAfterViewInit(): void {
        this.newSubscription = this._mapCanvas.onAspectRatioChanged
            .subscribe(canvasAspectRatio => this.handleMapCanvasSizeChange(canvasAspectRatio));
    }

    public setViewArea(viewArea: { latitude?: NumericRange, longitude?: NumericRange }): void {
        const aspectRatio = this._mapCanvas.aspectRatio;
        if (viewArea.latitude && viewArea.longitude) {
            const newLatitude = clamp(viewArea.latitude, this._latitudeLimits);
            const newLongitude = clamp(viewArea.longitude, this._longitudeLimits);
            this._latitude = newLatitude;
            this._longitude = newLongitude;
        } else if (viewArea.latitude) {
            const newLatitude = clamp(viewArea.latitude, this._latitudeLimits);
            this._latitude = newLatitude;
            const newLongitudeSize = (newLatitude.high - newLatitude.low) * aspectRatio.lonUnitsPerLatUnit;
            const newLongitudeDelta = newLongitudeSize - (this._longitude.high - this._longitude.low);
            this._longitude = zoomRangeByDelta(this._longitude, newLongitudeDelta, this._longitudeLimits);
        } else if (viewArea.longitude) {
            const newLongitude = clamp(viewArea.longitude, this._longitudeLimits);
            this._longitude = newLongitude;
            const newLatitudeSize = (newLongitude.high - newLongitude.low) * aspectRatio.latUnitsPerLonUnit;
            const newLatitudeDelta = newLatitudeSize - (this._latitude.high - this._latitude.low);
            this._latitude = zoomRangeByDelta(this._latitude, newLatitudeDelta, this._latitudeLimits);
        }
        this.updateMap();
    }

    public handleInteraction(interaction: {
        zoom?: ZoomEvent, pan?: PanEvent, mapContextMenu?: MapContextMenuEvent,
    }): void {
        if (interaction.zoom) {
            this.setViewArea({
                latitude: zoomRangeByDelta(this._latitude, interaction.zoom.latitudeDelta, this._latitudeLimits),
                longitude: zoomRangeByDelta(this._longitude, interaction.zoom.longitudeDelta, this._longitudeLimits),
            });
        } else if (interaction.pan) {
            this.setViewArea({
                latitude: shiftRangeByDelta(this._latitude, interaction.pan.latitudeDelta, this._latitudeLimits),
                longitude: shiftRangeByDelta(this._longitude, interaction.pan.longitudeDelta, this._longitudeLimits),
            });
        } else if (interaction.mapContextMenu) {
            this.openMapContextMenu(interaction.mapContextMenu);
        }
    }

    public handleContextMenuPositionClick(): void {
        this.closeMapContextMenu();
        alert("Copying position is not yet implemented.");
    }

    public handleContextMenuWhatHereClick(): void {
        this.closeMapContextMenu();
        alert("What's Here? functionality has not been implemented yet.");
    }

    private openMapContextMenu(mapContextMenuEvent: MapContextMenuEvent): void {
        this.closeMapContextMenu(); // Close the existing context menu if it exists

        const positionStrategy = this._overlay.position()
            .flexibleConnectedTo({x: mapContextMenuEvent.x, y: mapContextMenuEvent.y})
            .withPositions([
                {
                    originX: "end",
                    originY: "bottom",
                    overlayX: "end",
                    overlayY: "top",
                },
            ]);

        this._overlayRef = this._overlay.create({
            positionStrategy,
            scrollStrategy: this._overlay.scrollStrategies.close(),
        });

        const position: { longitude, latitude } = {
            longitude: mapContextMenuEvent.longitude,
            latitude: mapContextMenuEvent.latitude,
        };

        this._overlayRef.attach(new TemplatePortal(this._mapContextMenu, this._viewContainerRef, {
            $implicit: position,
        }));

        this._contextMenuSubscription = fromEvent<MouseEvent>(document, "click")
            .pipe(
                filter((event: MouseEvent) => {
                    const clickTarget = event.target as HTMLElement;
                    return !!this._overlayRef && !this._overlayRef.overlayElement.contains(clickTarget);
                }),
                take(1),
            ).subscribe(() => this.closeMapContextMenu());
        this.newSubscription = this._contextMenuSubscription; // Also add the subscription to the tracked list for cleanup in ngOnDestroy
    }

    private closeMapContextMenu(): void {
        if (this._contextMenuSubscription) {
            this._contextMenuSubscription.unsubscribe();
        }
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    }

    private updateMap(): void {
        this._mapCanvas.viewArea = {latitude: this._latitude, longitude: this._longitude};
        const mapImagesOrdered = [...this._mapImages];
        mapImagesOrdered.sort((a: MapItem, b: MapItem) => {
            if (a.altitude.low !== b.altitude.low) {
                return a.altitude.low - b.altitude.low;
            } else {
                return a.altitude.high - b.altitude.high;
            }
        });
        this._mapCanvas.mapImages = mapImagesOrdered;

        const mapItemLabels: MapLabel[] = [];
        for (const mapItem of mapImagesOrdered) {
            mapItemLabels.push({
                latitude: mapItem.latitude.high, longitude: (mapItem.longitude.high + mapItem.longitude.low) / 2, text: mapItem.name,
                colour: "white", fontSize: this.determineFontSize(mapItem),
            });
        }
        this._mapCanvas.mapLabel = mapItemLabels;
    }

    private determineFontSize(mapItem: MapItem): number {
        const visibleLatitudeLength = sizeOf(this._latitude);
        const mapItemLatitudeLength = sizeOf(mapItem.latitude);
        return (mapItemLatitudeLength / visibleLatitudeLength) * 200; // Scalar determined by experimentation
    }

    private addMapImage(mapImage: MapItem): void {
        this._mapImages.add(mapImage);
        const requiredAspectRatio = this._mapCanvas.aspectRatio;
        this.updateMapLimits(requiredAspectRatio);
        this._latitude = deepCopy(this._latitudeLimits);
        this._longitude = deepCopy(this._longitudeLimits);
        this.updateMap();
    }

    private handleMapCanvasSizeChange(requiredAspectRatio: CanvasAspectRatio): void {
        this.updateMapLimits(requiredAspectRatio);
        this._latitude.low = Math.max(this._latitude.low, this._latitudeLimits.low);
        this._latitude.high = Math.min(this._latitude.high, this._latitudeLimits.high);
        this._longitude.low = Math.max(this._longitude.low, this._longitudeLimits.low);
        this._longitude.high = Math.min(this._longitude.high, this._longitudeLimits.high);
    }

    private updateMapLimits(requiredAspectRatio: CanvasAspectRatio): void {
        if (this._mapImages.size === 0) {
            return;
        }
        const mapItemLimits: MapArea = {
            longitude: {low: Number.MAX_VALUE, high: Number.MIN_VALUE},
            latitude: {low: Number.MAX_VALUE, high: Number.MIN_VALUE},
        };
        for (const mapImage of this._mapImages) {
            mapItemLimits.longitude.low = Math.min(mapItemLimits.longitude.low, mapImage.longitude.low);
            mapItemLimits.longitude.high = Math.max(mapItemLimits.longitude.high, mapImage.longitude.high);
            mapItemLimits.latitude.low = Math.min(mapItemLimits.latitude.low, mapImage.latitude.low);
            mapItemLimits.latitude.high = Math.max(mapItemLimits.latitude.high, mapImage.latitude.high);
        }

        const bestFitMapItemLimits = bestFitForAspectRatio(mapItemLimits, requiredAspectRatio);
        this._latitudeLimits = bestFitMapItemLimits.latitude;
        this._longitudeLimits = bestFitMapItemLimits.longitude;
    }
}
