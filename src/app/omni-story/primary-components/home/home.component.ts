import {Component, OnInit} from "@angular/core";
import {RoutingComponent} from "../../abstract-components/RoutingComponent";
import {AuthService, User} from "@auth0/auth0-angular";
import {mergeMap, Observable, tap} from "rxjs";
import {Entity, EntityId, EntityIds, World, WorldId, WorldIds} from "@ttapi/domain/types.model";
import {Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {KeyValue} from "@angular/common";
import {SingleEntityService} from "@ttapi/application/single-entity.service";
import {MultipleEntityService} from "@ttapi/application/multiple-entity.service";

@Component({
    selector: "app-home-page",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent extends RoutingComponent implements OnInit {
    private _worlds: Map<WorldId, World> = new Map<WorldId, World>();
    private _entities: Map<EntityId, Entity> = new Map<EntityId, Entity>();
    private _worldId: WorldId;
    private _selectedType: "Location" | "Traveler" | "Event";

    public constructor(
        private _authService: AuthService,
        private _router: Router,
        private _singleEntityService: SingleEntityService,
        private _multipleEntityService: MultipleEntityService,
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
            mergeMap(() => this._multipleEntityService.getWorlds()),
            mergeMap((worldIds: WorldIds) => worldIds),
            mergeMap((worldId: WorldId) => this._singleEntityService.getEntity(worldId)),
        ).subscribe((world: World) => this._worlds.set(world.id, world));
    }

    public valueAscOrder(a: KeyValue<EntityId, Entity>, b: KeyValue<EntityId, Entity>): number {
        return a.value.name.localeCompare(b.value.name);
    }

    public view(worldId: WorldId, selection: "Location" | "Traveler" | "Event"): void {
        this._worldId = worldId;
        this._selectedType = selection;
        this._entities.clear();
        this.newSubscription = this._multipleEntityService.getWorldEntities(this.worldId, selection)
            .pipe(
                tap(this.buildAlertIfEmptyFunction(selection)),
                mergeMap((entityIds: EntityIds) => entityIds),
                mergeMap((entityId: EntityId) => this._singleEntityService.getEntity(this.worldId, entityId)),
            )
            .subscribe((entity: Entity) => this._entities.set(entity.id, entity));
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
