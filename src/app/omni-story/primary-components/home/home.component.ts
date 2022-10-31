import {Component, OnInit} from "@angular/core";
import {RoutingComponent} from "../../../common/components/RoutingComponent";
import {AuthService, User} from "@auth0/auth0-angular";
import {mergeMap, Observable} from "rxjs";
import {TtapiGatewayService} from "../../../timeline-tracker-api/ttapi-gateway.service";
import {World, WorldId, WorldIds} from "../../../timeline-tracker-api/ttapi-types";
import {Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
    selector: "app-home-page",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent extends RoutingComponent implements OnInit {
    private _worlds: Map<WorldId, World> = new Map<WorldId, World>();

    public constructor(
        private _authService: AuthService,
        private _ttapiGateway: TtapiGatewayService,
        private _router: Router,
    ) {
        super();
    }

    public get user(): Observable<User | null | undefined> {
        return this._authService.user$;
    }

    public get worlds(): Map<WorldId, World> {
        return this._worlds;
    }

    public ngOnInit(): void {
        this.user.pipe(
            filter((user: User | null | undefined) => user !== null && user !== undefined),
            mergeMap(() => this._ttapiGateway.fetch("/api/worlds", "get", {})),
            mergeMap((worldIds: WorldIds) => worldIds),
            mergeMap((worldId: WorldId) => this._ttapiGateway.fetch("/api/world/{worldId}", "get", {
                worldId,
            })),
        ).subscribe((world: World) => this._worlds.set(world.id, world));
    }
}
