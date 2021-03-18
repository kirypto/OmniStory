import {Component, Injectable} from "@angular/core";
import {LocationGatewayService} from "../../gateways/location-gateway.service";
import {from, Observable} from "rxjs";
import {filter, map, mergeMap} from "rxjs/operators";
import {Location} from "../../domain-types/location";
import {IdentifiedEntity} from "../../domain-types/identified-entity";
import {LocationFilters} from "../../gateways/filters";

@Component({
    selector: "app-entity-finder",
    templateUrl: "./entity-finder.component.html",
    styleUrls: ["./entity-finder.component.css"]
})
@Injectable({providedIn: "root"})
export class EntityFinderComponent {
    private _entitiesById: Map<string, IdentifiedEntity> = new Map<string, IdentifiedEntity>();
    private _selectedEntity: IdentifiedEntity;

    private _areFiltersVisible = false;
    public filterNameIs = "";
    public filterNameHas = "";
    public filterTaggedAll = "";
    public filterTaggedAny = "";
    public filterTaggedOnly = "";
    public filterTaggedNone = "";
    public filterSpanIncludes = "";
    public filterSpanIntersects = "";

    public constructor(
        private _locationGateway: LocationGatewayService
    ) {
    }

    public get entityIdsAndNames(): Map<string, string> {
        const namesById = new Map<string, string>();
        for (const entity of this._entitiesById.values()) {
            if (entity instanceof Location) {
                namesById.set(entity.id, entity.name);
            }
        }
        return namesById;
    }

    public get selectedLocation(): Location | undefined {
        return this._selectedEntity instanceof Location ? this._selectedEntity : undefined;
    }

    public findEntities(entityType: string): void {
        this._entitiesById.clear();
        this._selectedEntity = undefined;

        let entityObservable: Observable<IdentifiedEntity>;
        if (entityType === "location") {
            entityObservable = this.findLocations();
        } else {
            alert(`Finding ${entityType}s is not yet supported`);
            return;
        }
        entityObservable.pipe(
            filter((value) => value !== undefined),
        ).subscribe((location) => this._entitiesById.set(location.id, location));

    }

    public showEntitiy(entityId: string): void {
        this._selectedEntity = this._entitiesById.get(entityId);
        this._entitiesById.clear();
        this._areFiltersVisible = false;
    }

    public get areFiltersVisible(): boolean {
        return this._areFiltersVisible;
    }

    public toggleFilterVisibility(): void {
        this._areFiltersVisible = !this._areFiltersVisible;
    }

    private findLocations(): Observable<Location> {
        const filters: LocationFilters = {};
        if (this.filterNameIs) { filters.nameIs = this.filterNameIs; }
        if (this.filterNameHas) { filters.nameHas = this.filterNameHas; }
        if (this.filterTaggedAll) { filters.taggedAll = this.filterTaggedAll; }
        if (this.filterTaggedAny) { filters.taggedAny = this.filterTaggedAny; }
        if (this.filterTaggedNone) { filters.taggedNone = this.filterTaggedNone; }
        if (this.filterTaggedOnly) { filters.taggedOnly = this.filterTaggedOnly; }
        if (this.filterSpanIntersects) { filters.spanIntersects = this.filterSpanIntersects; }
        if (this.filterSpanIncludes) { filters.spanIncludes = this.filterSpanIncludes; }

        return this._locationGateway.getLocationIds(filters).pipe(
            mergeMap((locationIdsArr) => from(locationIdsArr)),
            map((locationId) => this._locationGateway.getLocation(locationId)),
            mergeMap((locationObservable) => locationObservable),
        );
    }
}

