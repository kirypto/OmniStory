import {Component, OnInit} from "@angular/core";

@Component({
    selector: "app-home-page",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

    public get RoutePaths(): typeof RoutePaths {
        return RoutePaths;
    }
}

enum RoutePaths {
    main = "",
    entitySearch = "entity-search",
}
