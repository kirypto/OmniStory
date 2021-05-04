import {Component, OnInit} from "@angular/core";
import {CalendarService} from "../../services/calendar/calendar.service";

@Component({
    selector: "app-continuum-input",
    templateUrl: "./continuum-input.component.html",
    styleUrls: ["./continuum-input.component.scss"]
})
export class ContinuumInputComponent implements OnInit {

    public constructor(
        private _calendarService: CalendarService
    ) {
    }

    public ngOnInit(): void {
    }

}
