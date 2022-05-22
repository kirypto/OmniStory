import {Component, Injectable} from "@angular/core";

import {from} from "rxjs";
import {filter, mergeMap} from "rxjs/operators";
import {IdentifiedEntity} from "../../types/identified-entity";
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
        private _ttapiGateway: TtapiGatewayService,
    ) {
    }

    public get entityIdsAndNames(): Map<string, string> {
        const namesById = new Map<string, string>();
        for (const [key, val] of this._entitiesById.entries()) {
            namesById.set(key, val.id);
        }
        return namesById;
    }

    public findEntities(entityType: string): void {
        // TODO: work in other entity types
        console.log(`Asked to retrieve ${entityType}, but only worlds retrieval is currently supported`);
        this._entitiesById.clear();
        this._ttapiGateway.retrieveWorldIds().pipe(
            filter((valueArr) => valueArr !== undefined),
            mergeMap((locationIdsArr) => from(locationIdsArr)),
        ).subscribe((value) => this._entitiesById.set(value, {id: value}));
    }
}

