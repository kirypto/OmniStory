import {Component, Injectable, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {Location} from "./timeline-tracker-api/entities/location";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
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

    get location(): Location {
        return new Location({
            id: "location-00000000-0000-4000-8000-000000000000",
            name: "a name",
            description: "a description",
            span: {
                latitude: {low: 11034.738, high: 11066.318},
                longitude: {low: 5457.91, high: 5483.174},
                altitude: {low: 0.972, high: 1.034},
                continuum: {low: -9383.0, high: Infinity},
                reality: {low: 0, high: 0},
            },
            tags: ["tag1"],
            metadata: new Map(Object.entries({meta_key: "meta_val"}))
        });
    }
}
