import {Component, Input} from "@angular/core";
import {CalendarService} from "../../services/calendar/calendar.service";
import {CalendarType} from "../../types/calendar-type";

@Component({
    selector: "app-continuum-input",
    templateUrl: "./continuum-input.component.html",
    styleUrls: ["./continuum-input.component.scss"]
})
export class ContinuumInputComponent {
    private _continuumLow = 0.0;
    private _continuumHigh = 0.0;

    public constructor(
        private _calendarService: CalendarService
    ) {
    }

    public get ContinuumHigh(): number {
        return this._continuumHigh;
    }

    @Input()
    public set ContinuumHigh(value: number) {
        this._continuumHigh = value;
        if (this._continuumLow > value) {
            this._continuumLow = value;
        }
    }

    public get ContinuumLow(): number {
        return this._continuumLow;
    }

    @Input()
    public set ContinuumLow(value: number) {
        this._continuumLow = value;
        if (this._continuumHigh < value) {
            this._continuumHigh = value;
        }
    }

    public get GregorianStart(): Date {
        if (this._calendarService.System !== CalendarType.Gregorian) {
            return null;
        }
        return this._calendarService.translateFromContinuum(this._continuumLow);
    }

    public get GregorianEnd(): Date {
        if (this._calendarService.System !== CalendarType.Gregorian) {
            return null;
        }
        return this._calendarService.translateFromContinuum(this._continuumHigh);
    }
}
