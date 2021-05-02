import {Injectable} from "@angular/core";
import {AppConfigService} from "../app-config/app-config.service";
import {CalendarType} from "../../types/calendar-type";

@Injectable({
    providedIn: "root"
})
export class CalendarService {
    private readonly _calendarSystem: CalendarType;
    private readonly _epoch: Date;

    private constructor(_appConfigService: AppConfigService) {
        this._calendarSystem = _appConfigService.CalendarConfig.system;

        this._epoch = new Date();
    }

    public get System(): CalendarType {
        return this._calendarSystem;
    }

    public translateFromContinuum(continuum: number): Date {
        if (this._calendarSystem === CalendarType.Gregorian) {
            const epochMillis = this._epoch.getTime();
            return new Date(epochMillis + (continuum * 24 * 60 * 60 * 1000));
        } else {
            throw new Error(`Unsupported calendar system ${this._calendarSystem}`);
        }
    }
}
