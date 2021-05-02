import {Component, OnInit} from "@angular/core";

@Component({
    selector: "app-world-calendar",
    templateUrl: "./world-calendar.component.html",
    styleUrls: ["./world-calendar.component.scss"]
})
export class WorldCalendarComponent implements OnInit {
    ContinuumLow = 0;

    constructor() {
    }

    ngOnInit(): void {
        setInterval(() => {
            this.ContinuumLow += 1;
            console.log(this.ContinuumLow);
        }, 2000);
    }

}
