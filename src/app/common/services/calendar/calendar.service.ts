import {Injectable} from "@angular/core";
import {AppConfigService} from "../app-config/app-config.service";
import {CalendarType} from "../../types/calendar-type";

@Injectable({
    providedIn: "root"
})
export class CalendarService {
    private _calendarSystem: CalendarType;

    constructor(_appConfigService: AppConfigService) {
        this._calendarSystem = _appConfigService.CalendarConfig.system;
        console.log(`Calendar system: ${this._calendarSystem}`);
    }
}
