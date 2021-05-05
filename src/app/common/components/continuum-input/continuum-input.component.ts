import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";

import {CalendarService} from "../../services/calendar/calendar.service";
import {CalendarPart} from "../../types/calendar-type";

@Component({
    selector: "app-continuum-input",
    templateUrl: "./continuum-input.component.html",
    styleUrls: ["./continuum-input.component.scss"]
})
export class ContinuumInputComponent implements OnChanges {
    public continuumParts: CalendarPart[] = [];

    @Input() public continuum: number;
    @Output() public continuumChange = new EventEmitter<number>();

    public constructor(
        private _calendarService: CalendarService
    ) {
    }

    public OnChange(): void {
        this.continuum = this._calendarService.translateToContinuum(this.continuumParts);
        this.continuumChange.emit(this.continuum);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.continuumParts = this._calendarService.translateFromContinuum(this.continuum);
    }

    public continuumPartTrackBy(index: number, _continuumPart: CalendarPart): number {
        // Identify using the index so that Angular does not re-render mid typing causing focus loss after each character change
        return index;
    }
}
