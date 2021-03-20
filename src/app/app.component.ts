import {Component, Injectable, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
@Injectable({providedIn: "root"})
export class AppComponent implements OnInit {
    private _title = "Timeline Tracker UI";

    constructor(
        private _titleService: Title,
    ) {
    }

    ngOnInit(): void {
        this._titleService.setTitle(this._title);
    }

    get title(): string {
        return this._title;
    }
}
