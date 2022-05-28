import {Component, ViewChild} from "@angular/core";
import {NumericRange} from "../../../common/simple-types";
import {MapCanvasComponent} from "../../../common/components/map-canvas/map-canvas.component";
import {ImageFetcherService} from "../../../common/services/image-fetcher.service";


@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"],
})
export class MapComponent {
    private readonly _testLimits: NumericRange = {low: 0, high: 100};
    @ViewChild(MapCanvasComponent) private _mapCanvas: MapCanvasComponent;
    private _latitude: NumericRange = {low: 5, high: 75};
    private _longitude: NumericRange = {low: 5, high: 75};
    private _altitude: NumericRange = {low: 5, high: 75};
    private _continuum: NumericRange = {low: 5, high: 75};

    public constructor(private _imageFetcher: ImageFetcherService) {
        this._imageFetcher.fetchImage("https://i.picsum.photos/id/199/200/300.jpg?hmac=GOJRy6ngeR2kvgwCS-aTH8bNUTZuddrykqXUW6AF2XQ")
            .then(value => {
                this._mapCanvas.mapImages = [{
                    x: {low: 10, high: 500},
                    y: {low: 10, high: 700},
                    source: value,
                }];
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

        this._mapCanvas.clear();
        const fontSize = 14;
        this._mapCanvas.fillText(`latitude: ${JSON.stringify(this._latitude)}`, 15, fontSize * 2, fontSize);
        this._mapCanvas.fillText(`longitude: ${JSON.stringify(this._longitude)}`, 15, fontSize * 3, fontSize);
        this._mapCanvas.fillText(`altitude: ${JSON.stringify(this._altitude)}`, 15, fontSize * 4, fontSize);
        this._mapCanvas.fillText(`continuum: ${JSON.stringify(this._continuum)}`, 15, fontSize * 5, fontSize);
    }
}
