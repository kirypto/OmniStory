import {Component, OnInit} from "@angular/core";

import {RoutePaths} from "../../types/route-paths";

@Component({
    selector: "app-home-page",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {

    public constructor() {
    }

    public get RoutePaths(): typeof RoutePaths {
        return RoutePaths;
    }

    public ngOnInit(): void {
    }
}
