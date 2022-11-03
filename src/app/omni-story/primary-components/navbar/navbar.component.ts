import {Component, EventEmitter, Output} from "@angular/core";
import {RoutingComponent} from "../../../common/components/RoutingComponent";
import {AuthService} from "@auth0/auth0-angular";
import {Router} from "@angular/router";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent extends RoutingComponent {
    @Output() public sidenavToggle = new EventEmitter();

    public constructor(private _authService: AuthService, private _router: Router) {
        super();
    }

    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }

    public doLogin(): void {
        this._authService.loginWithRedirect({
            appState: {target: this._router.url},
        });
    }

    public doLogout(): void {
        this._authService.logout({returnTo: document.location.origin});
    }
}
