import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {TtapiGatewayService} from "../../../timeline-tracker-api/ttapi-gateway.service";
import {filter} from "rxjs/operators";
import {SubscribingComponent} from "../../../common/components/SubscribingComponent";
import {EntityId, WorldId} from "../../../timeline-tracker-api/ttapi-types";

@Component({
    selector: "app-story",
    templateUrl: "./story.component.html",
    styleUrls: ["./story.component.scss"],
})
export class StoryComponent extends SubscribingComponent implements OnInit {
    private _worldId: WorldId;
    private _entityId: EntityId;

    public constructor(
        private _route: ActivatedRoute,
        private _ttapiGateway: TtapiGatewayService,
        private _router: Router,
    ) {
        super();
    }

    public get worldId(): string {
        return this._worldId;
    }

    public get entityId(): string {
        return this._entityId;
    }


    public ngOnInit(): void {
        this.loadEntity();
        this.newSubscription = this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
        ).subscribe(() => this.loadEntity());
    }

    private loadEntity(): void {
        const paramMap = this._route.snapshot.paramMap;
        this._worldId = paramMap.get("worldId");
        this._entityId = paramMap.get("entityId");
    }
}
