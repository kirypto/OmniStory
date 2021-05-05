import {Injectable} from "@angular/core";
import {AppConfigService} from "../app-config/app-config.service";
import {CalendarPart, CalendarType} from "../../types/calendar-type";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable({
    providedIn: "root"
})
export class CalendarService {
    private readonly _calendarSystem: CalendarType;
    private readonly _epoch: Date;

    public constructor(
        private _appConfigService: AppConfigService
    ) {
        this._calendarSystem = _appConfigService.CalendarConfig.system;
        this._epoch = new Date(2021, 1, 1);
    }

    public get System(): CalendarType {
        return this._calendarSystem;
    }

    public translateFromContinuum(continuum: number): CalendarPart[] {
        if (this._calendarSystem === CalendarType.Gregorian) {
            const epochMillis = this._epoch.getTime();
            const dateTime = new Date(epochMillis + (continuum * MILLISECONDS_PER_DAY));
            return [
                {name: "Year", value: dateTime.getFullYear()},
                {name: "Month", value: dateTime.getMonth()},
                {name: "Day", value: dateTime.getDay()},
                {name: "Hour", value: dateTime.getHours()},
                {name: "Minute", value: dateTime.getMinutes()},
                {name: "Second", value: dateTime.getSeconds()},
            ];
        } else {
            throw new Error(`Unsupported calendar system ${this._calendarSystem}`);
        }
    }

    public translateToContinuum(calendarParts: CalendarPart[]): number {
        const parts = new Map<string, number>();
        calendarParts.forEach(calendarPart => {
            if (calendarPart.value !== undefined) {
                parts.set(calendarPart.name, calendarPart.value);
            }
        });
        if (this._calendarSystem === CalendarType.Gregorian) {
            const date = new Date(
                parts.has("Year") ? parts.get("Year") : 0,
                parts.has("Month") ? parts.get("Month") : 0,
                parts.has("Day") ? parts.get("Day") : 0,
                parts.has("Hour") ? parts.get("Hour") : 0,
                parts.has("Minute") ? parts.get("Minute") : 0,
                parts.has("Second") ? parts.get("Second") : 0
            );
            const millisRelativeToEpoc = date.getTime() - this._epoch.getTime();
            return millisRelativeToEpoc / MILLISECONDS_PER_DAY;
        } else {
            throw new Error(`Unsupported calendar system ${this._calendarSystem}`);
        }
    }
}
