import {Component, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {NumericRange} from "../../../common/simple-types";



@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit, OnChanges {
    private readonly _testLimits: NumericRange = {low: 0, high: 100};
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
    }

    public get longitudeLimits(): NumericRange {
        return this._testLimits;
    }

    public get longitudeSelection(): NumericRange {
        return this._longitude;
    }

    public set longitudeSelection(value: NumericRange) {
        this._longitude = value;
    }

    public get altitudeLimits(): NumericRange {
        return this._testLimits;
    }

    public get altitudeSelection(): NumericRange {
        return this._altitude;
    }

    public set altitudeSelection(value: NumericRange) {
        this._altitude = value;
    }

    public get continuumLimits(): NumericRange {
        return this._testLimits;
    }

    public get continuumSelection(): NumericRange {
        return this._continuum;
    }

    public set continuumSelection(value: NumericRange) {
        this._continuum = value;
    }

    public ngOnInit(): void {
    }

    public ngOnChanges(changes: SimpleChanges): void {
    }
}
