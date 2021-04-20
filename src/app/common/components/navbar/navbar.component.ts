import {Component, Output, EventEmitter} from "@angular/core";
import {RoutePaths} from "../../types/route-paths";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent {
    @Output() public sidenavToggle = new EventEmitter();

    public constructor() {
    }

    public get RoutePaths(): typeof RoutePaths {
        return RoutePaths;
    }

    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }
}
