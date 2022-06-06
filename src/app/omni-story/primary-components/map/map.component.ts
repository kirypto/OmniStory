import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {NumericRange} from "../../../common/simple-types";
import {Area, CanvasAspectRatio, MapCanvasComponent, MapImage} from "../../../common/components/map-canvas/map-canvas.component";
import {ImageFetcherService} from "../../../common/services/image-fetcher.service";
import {deepCopy} from "../../../common/util";


interface MapImage2 extends MapImage {
    z: number;
}

function bestFitForAspectRatio(desiredArea: Area, requiredAspectRatio: CanvasAspectRatio): Area {
    const bestFitArea = deepCopy(desiredArea);
    const desiredHeight = desiredArea.y.high - desiredArea.y.low;
    const desiredWidth = desiredArea.x.high - desiredArea.x.low;
    const desiredVerticalUnitsPerHorizontal = desiredHeight / desiredWidth;
    const needsHorizontalPadding = (desiredVerticalUnitsPerHorizontal - requiredAspectRatio.verticalUnitsPerHorizontal) > 0;
    if (needsHorizontalPadding) {
        // Need to pad desired area horizontally to match aspect ratio
        const necessaryWidth = requiredAspectRatio.horizontalUnitsPerVertical * desiredHeight;
        const necessaryPadding = necessaryWidth - desiredWidth;
        bestFitArea.x.low -= necessaryPadding / 2;
        bestFitArea.x.high += necessaryPadding / 2;
    } else {
        // Need to pad desired area vertically to match aspect ratio
        const necessaryHeight = requiredAspectRatio.verticalUnitsPerHorizontal * desiredWidth;
        const necessaryPadding = necessaryHeight - desiredHeight;
        bestFitArea.y.low -= necessaryPadding / 2;
        bestFitArea.y.high += necessaryPadding / 2;
    }
    return bestFitArea;
}


@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"],
})
export class MapComponent implements AfterViewInit {
    @ViewChild(MapCanvasComponent) private _mapCanvas: MapCanvasComponent;
    private _latitude: NumericRange = {low: 0, high: 1};
    private _latitudeLimits: NumericRange = {low: 0, high: 1};
    private _longitude: NumericRange = {low: 0, high: 1};
    private _longitudeLimits: NumericRange = {low: 0, high: 1};
    private _altitude: NumericRange = {low: 25, high: 75};
    private _continuum: NumericRange = {low: 25, high: 75};

    private _mapImages: Set<MapImage2> = new Set<MapImage2>();

    public constructor(private _imageFetcher: ImageFetcherService) {
        this._imageFetcher.fetchImage("https://i.picsum.photos/id/199/200/300.jpg?hmac=GOJRy6ngeR2kvgwCS-aTH8bNUTZuddrykqXUW6AF2XQ")
            .then(value => {
                this.addMapImage({
                    x: {low: 3400, high: 5150},
                    y: {low: 7400, high: 8600},
                    z: 1,
                    source: value,
                });
            });
        this._imageFetcher.fetchImage("https://i.picsum.photos/id/199/200/300.jpg?hmac=GOJRy6ngeR2kvgwCS-aTH8bNUTZuddrykqXUW6AF2XQ")
            .then(value => {
                this.addMapImage({
                    x: {low: 0, high: 10000},
                    y: {low: 0, high: 10000},
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

    public setViewArea(viewArea: { latitude?: NumericRange, longitude?: NumericRange }): void {
        const aspectRatio = this._mapCanvas.aspectRatio;
        if (viewArea.latitude) {
            this._latitude = viewArea.latitude;
            const newLongitudeSize = (viewArea.latitude.high - viewArea.latitude.low) * aspectRatio.verticalUnitsPerHorizontal;
            const newLongitudeDelta = newLongitudeSize - (this._longitude.high - this._longitude.low);
            this._longitude = {
                low: this._longitude.low - newLongitudeDelta / 2,
                high: this._longitude.high + newLongitudeDelta / 2,
            };
        } else if (viewArea.longitude) {
            this._longitude = viewArea.longitude;
            const newLatitudeSize = (viewArea.longitude.high - viewArea.longitude.low) * aspectRatio.horizontalUnitsPerVertical;
            const newLatitudeDelta = newLatitudeSize - (this._latitude.high - this._latitude.low);
            this._latitude = {
                low: this._latitude.low - newLatitudeDelta / 2,
                high: this._latitude.high + newLatitudeDelta / 2,
            };
        }
        this.updateMap();
    }

    public ngAfterViewInit(): void {
        this._mapCanvas.onAspectRatioChanged.subscribe(canvasAspectRatio => this.handleMapCanvasSizeChange(canvasAspectRatio));
    }

    private updateMap(): void {
        this._mapCanvas.viewArea = {x: this._latitude, y: this._longitude};
        const mapImagesOrdered = [...this._mapImages];
        mapImagesOrdered.sort((a: MapImage2, b: MapImage2) => a.z - b.z);
        this._mapCanvas.mapImages = mapImagesOrdered;

        const fontSize = 14;
        const offset = 150;
        this._mapCanvas.mapLabel = [
            {text: `latitude: ${JSON.stringify(this._latitude)}`, x: 35, y: offset * 3, fontSize},
            {text: `longitude: ${JSON.stringify(this._longitude)}`, x: 35, y: offset * 4, fontSize},
            {text: `altitude: ${JSON.stringify(this._altitude)}`, x: 35, y: offset * 5, fontSize},
            {text: `continuum: ${JSON.stringify(this._continuum)}`, x: 35, y: offset * 6, fontSize},
        ];
    }

    private addMapImage(mapImage: MapImage2): void {
        this._mapImages.add(mapImage);
        const requiredAspectRatio = this._mapCanvas.aspectRatio;
        this.updateMapLimits(requiredAspectRatio);
        this._latitude = deepCopy(this._latitudeLimits);
        this._longitude = deepCopy(this._longitudeLimits);
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
        const mapItemLimits: Area = {
            x: {low: Number.MAX_VALUE, high: Number.MIN_VALUE},
            y: {low: Number.MAX_VALUE, high: Number.MIN_VALUE},
        };
        for (const mapImage of this._mapImages) {
            mapItemLimits.x.low = Math.min(mapItemLimits.x.low, mapImage.x.low);
            mapItemLimits.x.high = Math.max(mapItemLimits.x.high, mapImage.x.high);
            mapItemLimits.y.low = Math.min(mapItemLimits.y.low, mapImage.y.low);
            mapItemLimits.y.high = Math.max(mapItemLimits.y.high, mapImage.y.high);
        }

        const bestFitMapItemLimits = bestFitForAspectRatio(mapItemLimits, requiredAspectRatio);
        this._latitudeLimits = bestFitMapItemLimits.x;
        this._longitudeLimits = bestFitMapItemLimits.y;
    }
}
