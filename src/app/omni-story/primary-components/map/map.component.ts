import {Component, ViewChild} from "@angular/core";
import {NumericRange} from "../../../common/simple-types";
import {MapCanvasComponent, MapImage} from "../../../common/components/map-canvas/map-canvas.component";
import {ImageFetcherService} from "../../../common/services/image-fetcher.service";


interface MapImage2 extends MapImage {
    z: number;
}


@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"],
})
export class MapComponent {
    private readonly _testLimits: NumericRange = {low: 0, high: 10000};
    @ViewChild(MapCanvasComponent) private _mapCanvas: MapCanvasComponent;
    private _latitude: NumericRange = {low: 0, high: 10000};
    private _longitude: NumericRange = {low: 0, high: 10000};
    private _altitude: NumericRange = {low: 0, high: 750};
    private _continuum: NumericRange = {low: 0, high: 750};

    private _mapImages: Set<MapImage2> = new Set<MapImage2>();

    public constructor(private _imageFetcher: ImageFetcherService) {
        this._imageFetcher.fetchImage("https://i.picsum.photos/id/199/200/300.jpg?hmac=GOJRy6ngeR2kvgwCS-aTH8bNUTZuddrykqXUW6AF2XQ")
            .then(value => {
                this._mapImages.add({
                    x: {low: 0, high: 10000},
                    y: {low: 0, high: 10000},
                    z: 0,
                    source: value,
                });
            });
        this._imageFetcher.fetchImage("https://i.picsum.photos/id/199/200/300.jpg?hmac=GOJRy6ngeR2kvgwCS-aTH8bNUTZuddrykqXUW6AF2XQ")
            .then(value => {
                this._mapImages.add({
                    x: {low: 3400, high: 5150},
                    y: {low: 7400, high: 8600},
                    z: 1,
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
        return this._testLimits;
    }

    public get latitudeSelection(): NumericRange {
        return this._latitude;
    }

    public set latitudeSelection(value: NumericRange) {
        this._latitude = value;
        this.updateMap();
    }

    public get longitudeLimits(): NumericRange {
        return this._testLimits;
    }

    public get longitudeSelection(): NumericRange {
        return this._longitude;
    }

    public set longitudeSelection(value: NumericRange) {
        this._longitude = value;
        this.updateMap();
    }

    public get altitudeLimits(): NumericRange {
        return this._testLimits;
    }

    public get altitudeSelection(): NumericRange {
        return this._altitude;
    }

    public set altitudeSelection(value: NumericRange) {
        this._altitude = value;
        this.updateMap();
    }

    public get continuumLimits(): NumericRange {
        return this._testLimits;
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
}
