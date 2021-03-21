import {Component, Injectable} from "@angular/core";
import {LocationGatewayService} from "../../services/location-gateway.service";
import {from, Observable} from "rxjs";
import {filter, map, mergeMap} from "rxjs/operators";
import {Location} from "../../types/location";
import {IdentifiedEntity} from "../../types/identified-entity";
import {LocationFilters} from "../../services/filters";

@Component({
    selector: "app-entity-finder",
    templateUrl: "./entity-search.component.html",
    styleUrls: ["./entity-search.component.css"]
})
@Injectable({providedIn: "root"})
export class EntitySearchComponent {
    private _entitiesById: Map<string, IdentifiedEntity> = new Map<string, IdentifiedEntity>();

    public advancedSearch = true; // TODO: make this false by default once normal search is implemented
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

    public findEntities(entityType: string): void {
        this._entitiesById.clear();

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

