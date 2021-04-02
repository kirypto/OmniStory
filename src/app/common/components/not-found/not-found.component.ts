import {Component, OnInit} from "@angular/core";

import {RoutePaths} from "../../types/route-paths";

@Component({
    selector: "app-page-not-found-component",
    templateUrl: "./not-found.component.html",
    styleUrls: ["./not-found.component.css"]
})
export class NotFoundComponent implements OnInit {

    public constructor() {
    }

    public get RoutePaths(): typeof RoutePaths {
        return RoutePaths;
    }

    public ngOnInit(): void {
    }
}
