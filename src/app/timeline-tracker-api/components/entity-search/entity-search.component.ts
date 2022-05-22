import {Component, Injectable} from "@angular/core";

import {from, Observable} from "rxjs";
import {filter, map, mergeMap} from "rxjs/operators";

import {LocationFilters} from "../../services/filters";
import {LocationGatewayService} from "../../services/location-gateway/location-gateway.service";
import {IdentifiedEntity} from "../../types/identified-entity";
import {Location} from "../../types/location";
import {TtapiGatewayService} from "../../ttapi-gateway.service";

@Component({
    selector: "app-entity-finder",
    templateUrl: "./entity-search.component.html",
    styleUrls: ["./entity-search.component.scss"]
})
@Injectable({providedIn: "root"})
export class EntitySearchComponent {
    public advancedSearch = true; // TODO: make this false by default once normal search is implemented
    public filterNameIs = "";
    public filterNameHas = "";
    public filterTaggedAll = "";
    public filterTaggedAny = "";
    public filterTaggedOnly = "";
    public filterTaggedNone = "";
    public filterSpanIncludes = "";
    public filterSpanIntersects = "";

    private _entitiesById: Map<string, IdentifiedEntity> = new Map<string, IdentifiedEntity>();

    public constructor(
        private _locationGateway: LocationGatewayService,
        private _ttapiGateway: TtapiGatewayService,
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

        // let entityObservable: Observable<IdentifiedEntity>;
        // if (entityType === "location") {
        //     entityObservable = this.findLocations();
        // } else {
        //     alert(`Finding ${entityType}s is not yet supported`);
        //     return;
        // }
        this._ttapiGateway.retrieveWorldIds().pipe(
            filter((valueArr) => valueArr !== undefined),
            mergeMap((locationIdsArr) => from(locationIdsArr)),
        ).subscribe((value) => this._entitiesById.set(value, {id: value}));

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

        return this._locationGateway.retrieveLocationIds(filters).pipe(
            mergeMap((locationIdsArr) => from(locationIdsArr)),
            map((locationId) => this._locationGateway.retrieveLocation(locationId)),
            mergeMap((locationObservable) => locationObservable),
        );
    }
}

