import {Component, EventEmitter, Output} from "@angular/core";
import {RoutingComponent} from "../../../common/components/RoutingComponent";
import {AuthService} from "@auth0/auth0-angular";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent extends RoutingComponent {
    @Output() public sidenavToggle = new EventEmitter();

    public constructor(private _authService: AuthService) {
        super();
    }

    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }

    public doLogin(): void {
        this._authService.loginWithRedirect();
    }

    public doLogout(): void {
        this._authService.logout({returnTo: document.location.origin});
    }
}
