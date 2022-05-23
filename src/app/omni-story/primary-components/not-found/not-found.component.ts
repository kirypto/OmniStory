import {Component} from "@angular/core";
import {RoutingComponent} from "../../../common/components/RoutingComponent";

@Component({
    selector: "app-page-not-found-component",
    templateUrl: "./not-found.component.html",
    styleUrls: ["./not-found.component.css"]
})
export class NotFoundComponent extends RoutingComponent {

    public constructor() {
        super();
    }
}
