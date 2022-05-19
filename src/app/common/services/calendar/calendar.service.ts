// import {Injectable} from "@angular/core";
// import {AppConfigService} from "../app-config/app-config.service";
// import {CalendarType, ContinuumPart} from "../../types/calendar-type";
//
// const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
//
// @Injectable({
//     providedIn: "root"
// })
// export class CalendarService {
//     private readonly _calendarSystem: CalendarType;
//     private readonly _epoch: Date;
//
//     public constructor(
//         private _appConfigService: AppConfigService
//     ) {
//         this._calendarSystem = this._appConfigService.calendarConfig.system;
//         if (this._calendarSystem === CalendarType.Gregorian) {
//             this._epoch = new Date(Date.parse(this._appConfigService.calendarConfig.epoch));
//         } else {
//             throw new Error(`Unsupported calendar system ${this._calendarSystem}`);
//         }
//
// }
//
// public translateFromContinuum(continuum: number): ContinuumPart[] {
//         if (this._calendarSystem === CalendarType.Gregorian) {
//             const epochMillis = this._epoch.getTime();
//             const dateTime = new Date(epochMillis + (continuum * MILLISECONDS_PER_DAY));
//             return [
//                 {name: "Year", value: dateTime.getFullYear()},
//                 {name: "Month", value: dateTime.getMonth()},
//                 {name: "Date", value: dateTime.getDate()},
//                 {name: "Hour", value: dateTime.getHours()},
//                 {name: "Minute", value: dateTime.getMinutes()},
//                 {name: "Second", value: dateTime.getSeconds()},
//             ];
//         } else {
//             throw new Error(`Unsupported calendar system ${this._calendarSystem}`);
//         }
//     }
//
//     public translateToContinuum(continuumParts: ContinuumPart[]): number {
//         const parts = new Map<string, number>();
//         continuumParts.forEach(calendarPart => {
//             if (calendarPart.value !== undefined) {
//                 parts.set(calendarPart.name, calendarPart.value);
//             }
//         });
//         if (this._calendarSystem === CalendarType.Gregorian) {
//             const date = new Date(
//                 parts.has("Year") ? parts.get("Year") : 0,
//                 parts.has("Month") ? parts.get("Month") : 0,
//                 parts.has("Date") ? parts.get("Date") : 0,
//                 parts.has("Hour") ? parts.get("Hour") : 0,
//                 parts.has("Minute") ? parts.get("Minute") : 0,
//                 parts.has("Second") ? parts.get("Second") : 0
//             );
//             const millisRelativeToEpoc = date.getTime() - this._epoch.getTime();
//             return millisRelativeToEpoc / MILLISECONDS_PER_DAY;
//         } else {
//             throw new Error(`Unsupported calendar system ${this._calendarSystem}`);
//         }
//     }
// }
