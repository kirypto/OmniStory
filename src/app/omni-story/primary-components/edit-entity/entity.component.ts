import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Entity, EntityId, Journey, Span, WorldId} from "../../../timeline-tracker-api/ttapi-types";
import {TtapiGatewayService} from "../../../timeline-tracker-api/ttapi-gateway.service";
import {SubscribingComponent} from "../../../common/components/SubscribingComponent";
import {Observable} from "rxjs";
import {filter} from "rxjs/operators";

@Component({
    selector: "app-entity",
    templateUrl: "./entity.component.html",
    styleUrls: ["./entity.component.scss"],
})
export class EntityComponent extends SubscribingComponent implements OnInit {
    private _worldId: WorldId;
    private _entityId: EntityId;
    private _entity: Entity;

    public constructor(
        private _route: ActivatedRoute,
        private _ttapiGateway: TtapiGatewayService,
        private _router: Router,
    ) {
        super();
    }

    public get isLoaded(): boolean {
        return this._entity !== undefined;
    }

    public get worldId(): string {
        return this._worldId;
    }

    public get entityId(): string {
        return this._entityId;
    }

    public get name(): string {
        return this._entity?.name || "";
    }

    public set name(value: string) {
        if (this.isLoaded) {
            this._entity.name = value;
        }
    }

    public get description(): string {
        return this._entity?.description || "";
    }

    public set description(value: string) {
        if (this.isLoaded) {
            this._entity.description = value;
        }
    }

    public get tags(): string {
        return this.isLoaded ? JSON.stringify(this._entity.tags, null, 4) : "";
    }

    public set tags(value: string) {
        if (this.isLoaded) {
            this._entity.tags = JSON.parse(value);
        }
    }

    public get attributes(): string {
        return this.isLoaded ? JSON.stringify(this._entity.attributes, null, 4) : "";
    }

    public set attributes(value: string) {
        if (this.isLoaded) {
            this._entity.attributes = JSON.parse(value);
        }
    }

    public get span(): string {
        // Only applicable for Location and Event
        const asSpanningEntity = this._entity as { span: Span };
        let span = "";
        if (this.isLoaded && asSpanningEntity?.span) {
            span = JSON.stringify(asSpanningEntity.span, null, 4);
        }
        return span;
    }

    public set span(value: string) {
        // Only applicable for Location and Event
        const asSpanningEntity = this._entity as { span: Span };
        if (this.isLoaded && asSpanningEntity?.span) {
            asSpanningEntity.span = JSON.parse(value);
        }
    }

    public get journey(): string {
        // Only applicable for Traveler
        const asJourneyingEntity = this._entity as { journey: Journey };
        let journey = "";
        if (this.isLoaded && asJourneyingEntity?.journey) {
            journey = JSON.stringify(asJourneyingEntity.journey, null, 4);
        }
        return journey;
    }

    public set journey(value: string) {
        // Only applicable for Traveler
        const asJourneyingEntity = this._entity as { journey: Journey };
        if (this.isLoaded && asJourneyingEntity?.journey) {
            asJourneyingEntity.journey = JSON.parse(value);
        }
    }

    public ngOnInit(): void {
        this.loadEntity();
        this.newSubscription = this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
        ).subscribe(() => this.loadEntity());
    }

    private loadEntity(): void {
        this._entity = undefined;

        const paramMap = this._route.snapshot.paramMap;
        this._worldId = paramMap.get("worldId");
        this._entityId = paramMap.get("entityId");
        console.log(`Editing ${this._worldId} -> ${this._entityId}`);


        let fetchObservable: Observable<Entity>;
        if (this._entityId.startsWith("world")) {
            // TODO: Currently the routing does not support only providing a world id, ex '.../entity/world-123'. It would be nice to
            //  support this.
            fetchObservable = this._ttapiGateway.fetch("/api/world/{worldId}", "get", {
                worldId: this._worldId,
            });
        } else if (this._entityId.startsWith("location")) {
            fetchObservable = this._ttapiGateway.fetch("/api/world/{worldId}/location/{locationId}", "get", {
                worldId: this._worldId,
                locationId: this._entityId,
            });
        } else if (this._entityId.startsWith("traveler")) {
            fetchObservable = this._ttapiGateway.fetch("/api/world/{worldId}/traveler/{travelerId}", "get", {
                worldId: this._worldId,
                travelerId: this._entityId,
            });
        } else if (this._entityId.startsWith("event")) {
            fetchObservable = this._ttapiGateway.fetch("/api/world/{worldId}/event/{eventId}", "get", {
                worldId: this._worldId,
                eventId: this._entityId,
            });
        } else {
            throw new Error(`Cannot edit entity '${this._entityId}', unknown entity type`);
        }
        this.newSubscription = fetchObservable.subscribe((value: Entity) => this._entity = value);
    }
}
