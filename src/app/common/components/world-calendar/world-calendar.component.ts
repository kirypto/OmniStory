import {Component} from "@angular/core";

@Component({
    selector: "app-world-calendar",
    templateUrl: "./world-calendar.component.html",
    styleUrls: ["./world-calendar.component.scss"]
})
export class WorldCalendarComponent {
    private _continuumLow = 0;
    private _continuumHigh = 0;

    public constructor() {
    }

    get continuumLow(): number {
        return this._continuumLow;
    }

    set continuumLow(value: number) {
        this._continuumLow = value;
        this._continuumHigh = Math.max(this._continuumHigh, value);
    }

    get continuumHigh(): number {
        return this._continuumHigh;
    }

    set continuumHigh(value: number) {
        this._continuumHigh = value;
        this._continuumLow = Math.min(this._continuumLow, value);
    }
}
