import {Component, OnInit} from "@angular/core";
import {RoutingComponent} from "../../abstract-components/RoutingComponent";
import {AuthService, User} from "@auth0/auth0-angular";
import {mergeMap, Observable, tap} from "rxjs";
import {TtapiGatewayService} from "../../../timeline-tracker-api/ttapi-gateway.service";
import {
    Entity,
    EntityId,
    EventId,
    EventIds,
    LocationId,
    LocationIds,
    TravelerId,
    TravelerIds,
    World,
    WorldId,
    WorldIds,
} from "../../../timeline-tracker-api/ttapi-types";
import {Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {KeyValue} from "@angular/common";

@Component({
    selector: "app-home-page",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent extends RoutingComponent implements OnInit {
    private _worlds: Map<WorldId, World> = new Map<WorldId, World>();
    private _entities: Map<EntityId, Entity> = new Map<EntityId, Entity>();
    private _worldId: WorldId | undefined;
    private _selectedType: "Location" | "Traveler" | "Event";

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

    public get worldId(): WorldId | undefined {
        return this._worldId;
    }

    public get worldName(): string {
        return this._worldId === undefined ? "" : this._worlds.get(this._worldId).name;
    }

    public get showEntities(): boolean {
        return this._selectedType !== undefined;
    }

    public get entities(): Map<EntityId, Entity> {
        return this._entities;
    }

    public get selectedType(): "Location" | "Traveler" | "Event" {
        return this._selectedType;
    }

    public ngOnInit(): void {
        this.newSubscription = this.user.pipe(
            filter((user: User | null | undefined) => user !== null && user !== undefined),
            mergeMap(() => this._ttapiGateway.fetch("/api/worlds", "get", {})),
            mergeMap((worldIds: WorldIds) => worldIds),
            mergeMap((worldId: WorldId) => this._ttapiGateway.fetch("/api/world/{worldId}", "get", {
                worldId,
            })),
        ).subscribe((world: World) => this._worlds.set(world.id, world));
    }

    public valueAscOrder(a: KeyValue<EntityId, Entity>, b: KeyValue<EntityId, Entity>): number {
        return a.value.name.localeCompare(b.value.name);
    }

    public view(worldId: WorldId, selection: "Location" | "Traveler" | "Event"): void {
        this._worldId = worldId;
        this._selectedType = selection;
        this._entities.clear();
        let entityRetrievalObservable: Observable<Entity>;

        switch (selection) {
            case "Location":
                entityRetrievalObservable = this._ttapiGateway.fetch("/api/world/{worldId}/locations", "get", {
                    worldId,
                }).pipe(
                    tap(this.buildAlertIfEmptyFunction("Location")),
                    mergeMap((locationIds: LocationIds) => locationIds),
                    mergeMap((locationId: LocationId) => this._ttapiGateway.fetch("/api/world/{worldId}/location/{locationId}", "get", {
                        worldId, locationId,
                    })),
                );
                break;
            case "Traveler":
                entityRetrievalObservable = this._ttapiGateway.fetch("/api/world/{worldId}/travelers", "get", {
                    worldId,
                }).pipe(
                    tap(this.buildAlertIfEmptyFunction("Traveler")),
                    mergeMap((travelerIds: TravelerIds) => travelerIds),
                    mergeMap((travelerId: TravelerId) => this._ttapiGateway.fetch("/api/world/{worldId}/traveler/{travelerId}", "get", {
                        worldId, travelerId,
                    })),
                );
                break;
            case "Event":
                entityRetrievalObservable = this._ttapiGateway.fetch("/api/world/{worldId}/events", "get", {
                    worldId,
                }).pipe(
                    tap(this.buildAlertIfEmptyFunction("Event")),
                    mergeMap((eventIds: EventIds) => eventIds),
                    mergeMap((eventId: EventId) => this._ttapiGateway.fetch("/api/world/{worldId}/event/{eventId}", "get", {
                        worldId, eventId,
                    })),
                );
                break;
        }
        this.newSubscription = entityRetrievalObservable.subscribe((entity: Entity) => this._entities.set(entity.id, entity));
    }

    private buildAlertIfEmptyFunction(entityType: "Location" | "Traveler" | "Event"): (array: any[]) => void {
        const worldName = this.worldName;

        function alertIfEmpty(array: any[]): void {
            if (array.length === 0) {
                alert(`${worldName} has no ${entityType} entities.`);
            }
        }

        return alertIfEmpty;
    }
}
