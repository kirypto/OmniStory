import {Component, ViewChild} from "@angular/core";
import {NumericRange} from "../../../common/simple-types";
import {Area, MapCanvasComponent, MapImage} from "../../../common/components/map-canvas/map-canvas.component";
import {ImageFetcherService} from "../../../common/services/image-fetcher.service";
import {deepCopy} from "../../../common/util";


interface MapImage2 extends MapImage {
    z: number;
}


@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"],
})
export class MapComponent {
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

    public set latitudeSelection(value: NumericRange) {
        this._latitude = value;
        this.updateMap();
    }

    public get longitudeLimits(): NumericRange {
        return this._longitudeLimits;
    }

    public get longitudeSelection(): NumericRange {
        return this._longitude;
    }

    public set longitudeSelection(value: NumericRange) {
        this._longitude = value;
        this.updateMap();
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
        this.updateMapLimits();
        this._latitude = deepCopy(this._latitudeLimits);
        this._longitude = deepCopy(this._longitudeLimits);
    }

    private updateMapLimits(): void {
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

        const bestFitMapItemLimits = this.bestFitForAspectRatio(mapItemLimits);
        this._latitudeLimits = bestFitMapItemLimits.x;
        this._longitudeLimits = bestFitMapItemLimits.y;
        console.log(`New image added and map limits updated, now are: [${this._latitude.low},${this._latitude.high}] x [${this._longitude.low},${this._longitude.high}]`);
    }

    private bestFitForAspectRatio(desiredArea: Area): Area {
        const bestFitArea = deepCopy(desiredArea);
        const requiredAspectRatio = this._mapCanvas.pixelAspectRatio;
        const desiredAreaAspectRatio = (desiredArea.x.high - desiredArea.x.low) / (desiredArea.y.high - desiredArea.y.low);
        const necessaryAspectRatioAdjustment = desiredAreaAspectRatio - requiredAspectRatio;
        if (necessaryAspectRatioAdjustment > 0) {
            // Need to pad desired area horizontally to match aspect ratio
            const necessaryPadding = necessaryAspectRatioAdjustment * (desiredArea.x.high - desiredArea.x.low);
            console.log(`Need to pad horizontally by ${necessaryPadding}`);
            console.dir(desiredArea);
            console.dir(bestFitArea);
            console.log(`Before ${bestFitArea.x.low}`);
            bestFitArea.x.low -= necessaryPadding / 2;
            console.log(`After ${bestFitArea.x.low}`);
            bestFitArea.x.high += necessaryPadding / 2;
            console.dir(desiredArea);
            console.dir(bestFitArea);
        } else {
            // Need to pad desired area vertically to match aspect ratio
            const necessaryPadding = Math.abs(necessaryAspectRatioAdjustment) * (desiredArea.y.high - desiredArea.y.low);
            console.log(`Need to pad vertically by ${necessaryPadding}`);
            console.dir(desiredArea);
            console.dir(bestFitArea);
            console.log(`Before ${bestFitArea.y.low}`);
            bestFitArea.y.low -= necessaryPadding / 2;
            console.log(`After ${bestFitArea.y.low}`);
            bestFitArea.y.high += necessaryPadding / 2;
            console.dir(desiredArea);
            console.dir(bestFitArea);
        }

        return bestFitArea;
    }
}
