import {Component, OnInit} from "@angular/core";
import {RoutingComponent} from "../RoutingComponent";

@Component({
    selector: "app-home-page",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.css"]
})
export class MainComponent extends RoutingComponent implements OnInit {

    public constructor() {
        super();
    }

    public ngOnInit(): void {
    }
}
