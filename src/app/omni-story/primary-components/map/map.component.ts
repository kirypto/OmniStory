import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {NumericRange} from "../../../common/simple-types";


@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit, AfterViewInit {
    private readonly _testLimits: NumericRange = {low: 0, high: 100};
    @ViewChild("mapCanvas") private _mapCanvas: ElementRef;
    private _mapCanvasCtx: CanvasRenderingContext2D;
    private _latitude: NumericRange = {low: 5, high: 75};
    private _longitude: NumericRange = {low: 5, high: 75};
    private _altitude: NumericRange = {low: 5, high: 75};
    private _continuum: NumericRange = {low: 5, high: 75};

    public constructor() {
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

    public ngOnInit(): void {
    }

    public ngAfterViewInit(): void {
        this._mapCanvasCtx = this._mapCanvas.nativeElement.getContext("2d");
    }

    private updateMap(): void {
        this._mapCanvasCtx.clearRect(0, 0, this._mapCanvas.nativeElement.width, this._mapCanvas.nativeElement.height);
        const fontSize = 20;
        this._mapCanvasCtx.font = `${fontSize}px Arial`;
        this._mapCanvasCtx.fillStyle = "#d3d3d3";
        this._mapCanvasCtx.fillText(`latitude: ${JSON.stringify(this._latitude)}`, 15, fontSize * 2);
        this._mapCanvasCtx.fillText(`longitude: ${JSON.stringify(this._longitude)}`, 15, fontSize * 3);
        this._mapCanvasCtx.fillText(`altitude: ${JSON.stringify(this._altitude)}`, 15, fontSize * 4);
        this._mapCanvasCtx.fillText(`continuum: ${JSON.stringify(this._continuum)}`, 15, fontSize * 5);
    }
}
