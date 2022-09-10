import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location, LocationId, WorldId} from "../../../timeline-tracker-api/ttapi-types";
import {TtapiGatewayService} from "../../../timeline-tracker-api/ttapi-gateway.service";
import {SubscribingComponent} from "../../../common/components/SubscribingComponent";

@Component({
    selector: "app-entity",
    templateUrl: "./entity.component.html",
    styleUrls: ["./entity.component.scss"],
})
export class EntityComponent extends SubscribingComponent implements OnInit {
    private _worldId: WorldId;
    private _entityId: LocationId;
    private _entity: Location;

    public constructor(
        private _route: ActivatedRoute,
        private _ttapiGateway: TtapiGatewayService,
    ) {
        super();
    }

    public get worldId(): string {
        return this._worldId;
    }

    public get entityId(): string {
        return this._entityId;
    }

    public get name(): string {
        if (!this._entity) {
            return "";
        }
        return this._entity.name;
    }

    public get entityData(): string {
        if (!this._entity) {
            return "";
        }
        return JSON.stringify(this._entity, null, 4);
    }

    public ngOnInit(): void {
        const paramMap = this._route.snapshot.paramMap;
        this._worldId = paramMap.get("worldId");
        this._entityId = paramMap.get("entityId");
        console.log(`Editing ${this._worldId} -> ${this._entityId}`);
        // const entityType = this._entityId.split("-", 1)[0];
        //
        // switch (entityType) {
        //     case "location":
        //         const
        //         break;
        // }

        this.newSubscription = this._ttapiGateway.fetch("/api/world/{worldId}/location/{locationId}", "get", {
            worldId: this._worldId,
            locationId: this._entityId,
        }).subscribe((value: Location) => this._entity = value);
    }

}
