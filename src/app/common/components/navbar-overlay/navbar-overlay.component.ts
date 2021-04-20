import {Component, EventEmitter, Output} from "@angular/core";
import {RoutingComponent} from "../RoutingComponent";

@Component({
    selector: "app-navbar-overlay",
    templateUrl: "./navbar-overlay.component.html",
    styleUrls: ["./navbar-overlay.component.scss"]
})
export class NavbarOverlayComponent extends RoutingComponent {
    @Output() sidenavClose = new EventEmitter();

    constructor() {
        super();
    }

    public onSidenavClose = () => {
        this.sidenavClose.emit();
    }
}
