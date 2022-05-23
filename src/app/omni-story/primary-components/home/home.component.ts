import {Component, OnInit} from "@angular/core";
import {RoutingComponent} from "../../../common/components/RoutingComponent";
import {AuthService, User} from "@auth0/auth0-angular";
import {Observable} from "rxjs";
import {concatMap, filter, map, pluck} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: "app-home-page",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent extends RoutingComponent implements OnInit {
    private _medatata: Map<string, string> = new Map<string, string>();

    public constructor(private _authService: AuthService, private _httpClient: HttpClient) {
        super();
    }

    public get user(): Observable<User | null | undefined> {
        return this._authService.user$;
    }

    public get metadata(): Map<string, string> {
        return this._medatata;
    }

    public ngOnInit(): void {
        this._authService.user$.pipe(
            filter(value => value !== null && value !== undefined),
            concatMap(user => this._httpClient.get(encodeURI(`https://dev-80z7621b.us.auth0.com/api/v2/users/${user.sub}`))),
            // map(value => value.user_metadata as object)
            pluck("user_metadata"),
            map(value => value as object),
        ).subscribe(value => this._medatata = new Map<string, string>(Object.entries(value)));
    }
}
