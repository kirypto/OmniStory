import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {NumericRange, shiftRangeByDelta, zoomRangeByDelta} from "../../../common/numeric-range";
import {CanvasAspectRatio, MapArea, MapCanvasComponent, MapImage} from "../../../common/components/map-canvas/map-canvas.component";
import {ImageFetcherService} from "../../../common/services/image-fetcher.service";
import {deepCopy} from "../../../common/util";


interface MapImage2 extends MapImage {
    z: number;
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
export class MapComponent implements AfterViewInit {
    private WHEEL_ZOOM_SCALAR = 0.001;

    @ViewChild(MapCanvasComponent) private _mapCanvas: MapCanvasComponent;
    private _latitude: NumericRange = {low: 0, high: 1};
    private _latitudeLimits: NumericRange = {low: 0, high: 1};
    private _longitude: NumericRange = {low: 0, high: 1};
    private _longitudeLimits: NumericRange = {low: 0, high: 1};
    private _altitude: NumericRange = {low: 25, high: 75};
    private _continuum: NumericRange = {low: 25, high: 75};

    private _mapImages: Set<MapImage2> = new Set<MapImage2>();

    private _isPanning = false;

    public constructor(private _imageFetcher: ImageFetcherService) {
        this._imageFetcher.fetchImage(
            // "https://i.picsum.photos/id/199/200/300.jpg?hmac=GOJRy6ngeR2kvgwCS-aTH8bNUTZuddrykqXUW6AF2XQ"
            "http://localhost:8000/mainRegion.png",
        ).then(value => {
            this.addMapImage({
                latitude: {low: 7400, high: 8600},
                longitude: {low: 3400, high: 5150},
                z: 1,
                source: value,
            });
        });
        this._imageFetcher.fetchImage(
            // "https://i.picsum.photos/id/199/200/300.jpg?hmac=GOJRy6ngeR2kvgwCS-aTH8bNUTZuddrykqXUW6AF2XQ"
            "http://localhost:8000/supercontinent.jpg",
        ).then(value => {
            this.addMapImage({
                latitude: {low: 0, high: 10000},
                longitude: {low: 0, high: 10000},
                z: 0,
                source: value,
            });
        });
    }

    public get selections(): string {
        return JSON.stringify({
            latitude: this._latitude,
            longitude: this._longitude,
            altitude: this._altitude,
            continuum: this._continuum,
        }, null, 4);
    }

    public get latitudeLimits(): NumericRange {
        return this._latitudeLimits;
    }

    public get latitudeSelection(): NumericRange {
        return this._latitude;
    }

    public get longitudeLimits(): NumericRange {
        return this._longitudeLimits;
    }

    public get longitudeSelection(): NumericRange {
        return this._longitude;
    }

    public get altitudeLimits(): NumericRange {
        return {low: 0, high: 100};
    }

    public get altitudeSelection(): NumericRange {
        return this._altitude;
    }

    public set altitudeSelection(value: NumericRange) {
        this._altitude = value;
        this.updateMap();
    }

    public get continuumLimits(): NumericRange {
        return {low: 0, high: 100};
    }

    public get continuumSelection(): NumericRange {
        return this._continuum;
    }

    public set continuumSelection(value: NumericRange) {
        this._continuum = value;
        this.updateMap();
    }

    public ngAfterViewInit(): void {
        this._mapCanvas.onAspectRatioChanged.subscribe(canvasAspectRatio => this.handleMapCanvasSizeChange(canvasAspectRatio));
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
        wheel?: WheelEvent; mouseDown?: MouseEvent; mouseMove?: MouseEvent, mouseUp?: MouseEvent
    }): void {
        if (interaction.wheel) {
            const latitudeSize = this._latitude.high - this._latitude.low;
            const latitudeDelta = latitudeSize * interaction.wheel.deltaY * this.WHEEL_ZOOM_SCALAR;
            this.setViewArea({latitude: zoomRangeByDelta(this._latitude, latitudeDelta, this._latitudeLimits)});
        } else if (!this._isPanning && interaction.mouseDown && interaction.mouseDown.button === 0) {
            this._isPanning = true;
        } else if (this._isPanning && interaction.mouseMove) {
            const latitudeSize = this._latitude.high - this._latitude.low;
            const longitudeSize = this._longitude.high - this._longitude.low;
            const panScalar = -0.001;
            const latitudeDelta = latitudeSize * interaction.mouseMove.movementY * panScalar;
            const longitudeDelta = longitudeSize * interaction.mouseMove.movementX * panScalar;
            this.setViewArea({
                latitude: shiftRangeByDelta(this._latitude, latitudeDelta, this._latitudeLimits),
                longitude: shiftRangeByDelta(this._longitude, longitudeDelta, this._longitudeLimits),
            });
        } else if (this._isPanning && interaction.mouseUp && interaction.mouseUp.button === 0) {
            this._isPanning = false;
        }
    }

    private updateMap(): void {
        this._mapCanvas.viewArea = {latitude: this._latitude, longitude: this._longitude};
        const mapImagesOrdered = [...this._mapImages];
        mapImagesOrdered.sort((a: MapImage2, b: MapImage2) => a.z - b.z);
        this._mapCanvas.mapImages = mapImagesOrdered;

        const fontSize = 14;
        const offset = 150;
        this._mapCanvas.mapLabel = [
            {text: `latitude: ${JSON.stringify(this._latitude)}`, latitude: offset * 3, longitude: 35, fontSize},
            {text: `longitude: ${JSON.stringify(this._longitude)}`, latitude: offset * 4, longitude: 35, fontSize},
            {text: `altitude: ${JSON.stringify(this._altitude)}`, latitude: offset * 5, longitude: 35, fontSize},
            {text: `continuum: ${JSON.stringify(this._continuum)}`, latitude: offset * 6, longitude: 35, fontSize},
        ];
    }

    private addMapImage(mapImage: MapImage2): void {
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
        console.log("1: MapItems, 2: best fit");
        console.dir(deepCopy(mapItemLimits));
        console.dir(deepCopy(bestFitMapItemLimits));
        this._latitudeLimits = bestFitMapItemLimits.latitude;
        this._longitudeLimits = bestFitMapItemLimits.longitude;
    }
}
