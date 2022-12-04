import {Component, EventEmitter, Output} from "@angular/core";
import {RoutingComponent} from "../../abstract-components/RoutingComponent";
import {AuthService, User} from "@auth0/auth0-angular";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent extends RoutingComponent {
    @Output() public sidenavToggle = new EventEmitter();
    private _isLoggedIn = false;

    public constructor(private _authService: AuthService, private _router: Router) {
        super();
        this._authService.isAuthenticated$.subscribe(isLoggedIn => this._isLoggedIn = isLoggedIn);
    }

    public get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    public get user(): Observable<User | null | undefined> {
        return this._authService.user$;
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
