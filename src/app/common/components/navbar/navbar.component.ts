import {Component, EventEmitter, Output} from "@angular/core";
import {RoutingComponent} from "../RoutingComponent";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent extends RoutingComponent {
    @Output() public sidenavToggle = new EventEmitter();

    public constructor() {
        super();
    }

    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }
}
