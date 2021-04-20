import {Component, OnInit} from "@angular/core";
import {RoutingComponent} from "../RoutingComponent";

@Component({
    selector: "app-home-page",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent extends RoutingComponent implements OnInit {

    public constructor() {
        super();
    }

    public ngOnInit(): void {
    }
}
