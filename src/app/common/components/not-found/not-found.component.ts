import {Component, OnInit} from "@angular/core";
import {RoutePaths} from "../../../app.module";

@Component({
    selector: "app-page-not-found-component",
    templateUrl: "./not-found.component.html",
    styleUrls: ["./not-found.component.css"]
})
export class NotFoundComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

    public get RoutePaths(): typeof RoutePaths {
        return RoutePaths;
    }
}
