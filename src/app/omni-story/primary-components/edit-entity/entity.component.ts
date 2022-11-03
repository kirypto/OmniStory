import {Component, OnInit} from "@angular/core";
import {Location as AngularLocation} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Entity, EntityId, Journey, Location, PatchRequest, Span, WorldId} from "../../../timeline-tracker-api/ttapi-types";
import {TtapiGatewayService} from "../../../timeline-tracker-api/ttapi-gateway.service";
import {SubscribingComponent} from "../../../common/components/SubscribingComponent";
import {Observable} from "rxjs";
import {filter} from "rxjs/operators";
import {deepEqual} from "json-joy/esm/json-equal/deepEqual";
import {deepCopy} from "../../../common/util";
import {arrayRequestBody} from "openapi-typescript-fetch";

@Component({
    selector: "app-entity",
    templateUrl: "./entity.component.html",
    styleUrls: ["./entity.component.scss"],
})
export class EntityComponent extends SubscribingComponent implements OnInit {
    private _worldId: WorldId;
    private _entityId: EntityId;
    private _entity: Entity;
    private _entityOrig: Entity;

    public constructor(
        private _route: ActivatedRoute,
        private _ttapiGateway: TtapiGatewayService,
        private _router: Router,
        private _location: AngularLocation
    ) {
        super();
    }

    public get isLoaded(): boolean {
        return this._entity !== undefined;
    }

    public get readyForSave(): boolean {
        try {
            return this.isLoaded && !deepEqual(this._entityOrig, this._entity);
        } catch {
            return false;
        }
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

    public saveEntity(): void {
        const entityPatch = this.constructDiffPatch();
        console.log(`Save called. PATCH is: ${JSON.stringify(entityPatch)}`);

        let fetchObservable: Observable<Entity>;
        if (this._entityId === "newLocation") {
            const args = {
                worldId: this.worldId, ...(this._entity as Location),
            };
            fetchObservable = this._ttapiGateway.fetch("/api/world/{worldId}/location", "post", args);
        } else if (this._entityId.startsWith("world")) {
            // TODO: Currently the routing does not support only providing a world id, ex '.../entity/world-123'. It would be nice to
            //  support this.
            fetchObservable = this._ttapiGateway.fetch("/api/world/{worldId}", "patch", arrayRequestBody(
                entityPatch,
                {
                    worldId: this._worldId,
                }));
        } else if (this._entityId.startsWith("location")) {
            fetchObservable = this._ttapiGateway.fetch("/api/world/{worldId}/location/{locationId}", "patch", arrayRequestBody(
                entityPatch,
                {
                    worldId: this._worldId,
                    locationId: this._entityId,
                }));
        } else if (this._entityId.startsWith("traveler")) {
            fetchObservable = this._ttapiGateway.fetch("/api/world/{worldId}/traveler/{travelerId}", "patch", arrayRequestBody(
                entityPatch,
                {
                    worldId: this._worldId,
                    travelerId: this._entityId,
                }));
        } else if (this._entityId.startsWith("event")) {
            fetchObservable = this._ttapiGateway.fetch("/api/world/{worldId}/event/{eventId}", "patch", arrayRequestBody(
                entityPatch,
                {
                    worldId: this._worldId,
                    eventId: this._entityId,
                }));
        } else {
            throw new Error(`Cannot edit entity '${this._entityId}', unknown entity type`);
        }
        this.newSubscription = fetchObservable.subscribe((value: Entity) => {
            console.log(`Returned from save, received: ${JSON.stringify(value)}`);
            this._entityId = value.id;
            this._entity = value;
            this._entityOrig = deepCopy(value);
            this._location.replaceState(`/entity/${this._worldId}/${this._entityId}`);
        });
    }

    private loadEntity(): void {
        this._entity = undefined;
        this._entityOrig = undefined;

        const paramMap = this._route.snapshot.paramMap;
        this._worldId = paramMap.get("worldId");
        this._entityId = paramMap.get("entityId");

        switch (this._entityId) {
            case "newLocation":
                console.log(`Creating a new location!`);
                const entity: Location = {
                    id: "", name: "", description: "", span: {
                        latitude: {low: 0, high: 0}, longitude: {low: 0, high: 0}, altitude: {low: 0, high: 0},
                        continuum: {low: 0, high: 0}, reality: [0],
                    }, tags: [], attributes: {},
                };
                this._entity = entity;
                this._entityOrig = deepCopy(entity);
                break;
            default:
                let fetchObservable: Observable<Entity>;
                if (this._entityId.startsWith("world")) {
                    // TODO: Currently the routing does not support only providing a world id, ex '.../entity/world-123'. It would be nice
                    //  to support this.
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
                this.newSubscription = fetchObservable.subscribe((value: Entity) => {
                    this._entityId = value.id;
                    this._entity = value;
                    this._entityOrig = deepCopy(value);
                    this._location.replaceState(`/entity/${this._worldId}/${this._entityId}`);
                });
        }
    }

    private constructDiffPatch(): PatchRequest {
        if (!this.isLoaded) {
            throw new Error("Cannot construct diff when no entity is loaded.");
        }
        const entityPatch = [];
        if (this._entityOrig.name !== this._entity.name) {
            entityPatch.push({op: "replace", path: "/name", value: this._entity.name});
        }
        if (this._entityOrig.description !== this._entity.description) {
            entityPatch.push({op: "replace", path: "/description", value: this._entity.description});
        }
        if (!deepEqual(this._entityOrig.tags, this._entity.tags)) {
            entityPatch.push({op: "replace", path: "/tags", value: this._entity.tags});
        }
        if (!deepEqual(this._entityOrig.attributes, this._entity.attributes)) {
            entityPatch.push({op: "replace", path: "/attributes", value: this._entity.attributes});
        }
        const asJourneyingEntity = this._entity as { journey: Journey };
        if (asJourneyingEntity && asJourneyingEntity.journey &&
            !deepEqual((this._entityOrig as { journey: Journey }).journey, asJourneyingEntity.journey)) {
            entityPatch.push({op: "replace", path: "/journey", value: asJourneyingEntity.journey});
        }
        const asSpanningEntity = this._entity as { span: Span };
        if (asSpanningEntity && asSpanningEntity.span &&
            !deepEqual((this._entityOrig as { span: Span }).span, asSpanningEntity.span)) {
            entityPatch.push({op: "replace", path: "/span", value: asSpanningEntity.span});
        }
        return entityPatch;
    }
}
