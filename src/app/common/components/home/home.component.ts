import {Component, OnInit} from "@angular/core";
import {RoutingComponent} from "../RoutingComponent";
import {AuthService, User} from "@auth0/auth0-angular";
import {Observable} from "rxjs";

@Component({
    selector: "app-home-page",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent extends RoutingComponent implements OnInit {

    public constructor(private _authService: AuthService) {
        super();
    }

    public get user(): Observable<User | null | undefined> {
        return this._authService.user$;
    }

    public ngOnInit(): void {
    }
}
