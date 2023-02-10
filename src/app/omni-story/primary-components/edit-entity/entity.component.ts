import {Component, OnInit} from "@angular/core";
import {Location as AngularLocation} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Entity, EntityId, Event, Journey, Location, PatchRequest, Span, Traveler, World, WorldId} from "@ttapi/domain/types.model";
import {TtapiGatewayService} from "@ttapi/ttapi-gateway.service";
import {SubscribingComponent} from "../../../common/components/SubscribingComponent";
import {Observable} from "rxjs";
import {filter} from "rxjs/operators";
import {deepEqual} from "json-joy/esm/json-equal/deepEqual";
import {deepCopy} from "../../../common/util";
import {arrayRequestBody} from "openapi-typescript-fetch";
import {RoutePaths} from "../../route-paths";
import {SingleEntityService} from "@ttapi/application/single-entity.service";

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
        private _location: AngularLocation,
        private _singleEntityService: SingleEntityService,
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

    public get readyForDelete(): boolean {
        return this._entityId !== undefined && !this._entityId.startsWith("new");
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
        return this.isLoaded && asJourneyingEntity?.journey ? JSON.stringify(asJourneyingEntity.journey, null, 4) : "";
    }

    public set journey(value: string) {
        // Only applicable for Traveler
        const asJourneyingEntity = this._entity as { journey: Journey };
        if (this.isLoaded && asJourneyingEntity?.journey) {
            asJourneyingEntity.journey = JSON.parse(value);
        }
    }

    public get affectedLocations(): string {
        // Only applicable for Event
        const asEvent = this._entity as Event;
        return this.isLoaded && asEvent?.affected_locations ? JSON.stringify(asEvent?.affected_locations, null, 4) : "";
    }

    public set affectedLocations(value: string) {
        // Only applicable for Event
        const asEvent = this._entity as Event;
        if (this.isLoaded && asEvent?.affected_locations) {
            asEvent.affected_locations = JSON.parse(value);
        }
    }

    public get affectedTravelers(): string {
        // Only applicable for Event
        const asEvent = this._entity as Event;
        return this.isLoaded && asEvent?.affected_travelers ? JSON.stringify(asEvent?.affected_travelers, null, 4) : "";
    }

    public set affectedTravelers(value: string) {
        // Only applicable for Event
        const asEvent = this._entity as Event;
        if (this.isLoaded && asEvent?.affected_travelers) {
            asEvent.affected_travelers = JSON.parse(value);
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

        let fetchObservable: Observable<Entity>;
        if (this._worldId === "new" && this._entityId === "world") {
            fetchObservable = this._ttapiGateway.fetch("/api/world", "post", {}, {}, this._entity);
            // const args = {
            //     ...(this._entity as World),
            // };
            // fetchObservable = this._ttapiGateway.fetch("/api/world", "post", args);
        } else if (this._entityId === "newLocation") {
            const args = {
                worldId: this.worldId, ...(this._entity as Location),
            };
            fetchObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/location", "post", args);
        } else if (this._entityId === "newTraveler") {
            const args = {
                worldId: this.worldId, ...(this._entity as Traveler),
            };
            fetchObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/traveler", "post", args);
        } else if (this._entityId === "newEvent") {
            const args = {
                worldId: this.worldId, ...(this._entity as Event),
            };
            fetchObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/event", "post", args);
        } else if (this._entityId.startsWith("world")) {
            // TODO: Currently the routing does not support only providing a world id, ex '.../entity/world-123'. It would be nice to
            //  support this.
            fetchObservable = this._ttapiGateway.fetch(
                "/api/world/{worldId}", "patch", {worldId: this._worldId}, {}, entityPatch,
            );

            // fetchObservable = this._ttapiGateway.fetch("/api/world/{worldId}", "patch", arrayRequestBody(
            //     entityPatch,
            //     {
            //         worldId: this._worldId,
            //     }));
        } else if (this._entityId.startsWith("location")) {
            fetchObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/location/{locationId}", "patch", arrayRequestBody(
                entityPatch,
                {
                    worldId: this._worldId,
                    locationId: this._entityId,
                }));
        } else if (this._entityId.startsWith("traveler")) {
            fetchObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/traveler/{travelerId}", "patch", arrayRequestBody(
                entityPatch,
                {
                    worldId: this._worldId,
                    travelerId: this._entityId,
                }));
        } else if (this._entityId.startsWith("event")) {
            fetchObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/event/{eventId}", "patch", arrayRequestBody(
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
            if (value.id.startsWith("world")) {
                this._worldId = value.id;
            }
            this._entityId = value.id;
            this._entity = value;
            this._entityOrig = deepCopy(value);
            this._location.replaceState(`/entity/${this._worldId}/${this._entityId}`);
        });
    }

    public deleteEntity(): void {
        if (!confirm(`Delete ${this.name}?`)) {
            return;
        }
        let deleteObservable: Observable<unknown>;
        if (this._entityId.startsWith("world")) {
            deleteObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}", "delete", {
                worldId: this._worldId,
            });
        } else if (this._entityId.startsWith("location")) {
            deleteObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/location/{locationId}", "delete", {
                worldId: this._worldId,
                locationId: this._entityId,
            });
        } else if (this._entityId.startsWith("traveler")) {
            deleteObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/traveler/{travelerId}", "delete", {
                worldId: this._worldId,
                travelerId: this._entityId,
            });
        } else if (this._entityId.startsWith("event")) {
            deleteObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/event/{eventId}", "delete", {
                worldId: this._worldId,
                eventId: this._entityId,
            });
        } else {
            throw new Error(`Cannot delete entity '${this._entityId}', unsupported type.`);
        }
        deleteObservable.subscribe(() => {
            this._router.navigate([RoutePaths.home])
                .then(() => console.log(`Deleted ${this._entityId}, returned home.`));
        });
    }

    private loadEntity(): void {
        this._entity = undefined;
        this._entityOrig = undefined;

        const paramMap = this._route.snapshot.paramMap;
        this._worldId = paramMap.get("worldId");
        this._entityId = paramMap.get("entityId");

        if (this._worldId === "new" && this._entityId === "world") {
            const world: World = {
                id: "", name: "", description: "", tags: [], attributes: {},
            };
            this._entity = world;
            this._entityOrig = deepCopy(world);
        } else if (this._entityId === "newLocation") {
            const location: Location = {
                id: "", name: "", description: "", span: {
                    latitude: {low: 0, high: 0}, longitude: {low: 0, high: 0}, altitude: {low: 0, high: 0},
                    continuum: {low: 0, high: 0}, reality: [0],
                }, tags: [], attributes: {},
            };
            this._entity = location;
            this._entityOrig = deepCopy(location);
        } else if (this._entityId === "newTraveler") {
            const traveler: Traveler = {
                id: "", name: "", description: "", journey: [
                    {position: {latitude: 0, longitude: 0, altitude: 0, continuum: 0, reality: 0}, movement_type: "immediate"},
                ], tags: [], attributes: {},
            };
            this._entity = traveler;
            this._entityOrig = deepCopy(traveler);
        } else if (this._entityId === "newEvent") {
            const event: Event = {
                id: "", name: "", description: "", span: {
                    latitude: {low: 0, high: 0}, longitude: {low: 0, high: 0}, altitude: {low: 0, high: 0},
                    continuum: {low: 0, high: 0}, reality: [0],
                }, affected_locations: [], affected_travelers: [], tags: [], attributes: {},
            };
            this._entity = event;
            this._entityOrig = deepCopy(event);
        } else {
            this.newSubscription = this._singleEntityService.getEntity(this._worldId, this._entityId)
                .subscribe((value: Entity) => {
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
        const asEvent = this._entity as Event;
        if (asEvent && asEvent.affected_locations
            && !deepEqual((this._entityOrig as Event).affected_locations, asEvent.affected_locations)) {
            entityPatch.push({op: "replace", path: "/affected_locations", value: asEvent.affected_locations});
        }
        if (asEvent && asEvent.affected_travelers
            && !deepEqual((this._entityOrig as Event).affected_travelers, asEvent.affected_travelers)) {
            entityPatch.push({op: "replace", path: "/affected_travelers", value: asEvent.affected_travelers});
        }
        return entityPatch;
    }
}
