import {Component, EventEmitter, Output} from "@angular/core";
import {RoutePaths} from "../../types/route-paths";

@Component({
    selector: "app-navbar-overlay",
    templateUrl: "./navbar-overlay.component.html",
    styleUrls: ["./navbar-overlay.component.css"]
})
export class NavbarOverlayComponent {
    @Output() sidenavClose = new EventEmitter();

    constructor() {
    }

    public get RoutePaths(): typeof RoutePaths {
        return RoutePaths;
    }

    public onSidenavClose = () => {
        this.sidenavClose.emit();
    }
}
