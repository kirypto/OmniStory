import {Component, Injectable} from "@angular/core";

import {from} from "rxjs";
import {filter, mergeMap} from "rxjs/operators";
import {TtapiGatewayService} from "../../../timeline-tracker-api/ttapi-gateway.service";
import {WorldIds} from "../../../timeline-tracker-api/ttapi-types";
import {SubscribingComponent} from "../../../common/components/SubscribingComponent";

@Component({
    selector: "app-entity-finder",
    templateUrl: "./entity-search.component.html",
    styleUrls: ["./entity-search.component.scss"],
})
@Injectable({providedIn: "root"})
export class EntitySearchComponent extends SubscribingComponent {
    public advancedSearch = true; // TODO: make this false by default once normal search is implemented
    public filterNameIs = "";
    public filterNameHas = "";
    public filterTaggedAll = "";
    public filterTaggedAny = "";
    public filterTaggedOnly = "";
    public filterTaggedNone = "";
    public filterSpanIncludes = "";
    public filterSpanIntersects = "";

    private _entityIds: Set<string> = new Set<string>();

    public constructor(
        private _ttapiGateway: TtapiGatewayService,
    ) {
        super();
    }

    public get entityIds(): Set<string> {
        const ids = new Set<string>();
        for (const id of this._entityIds) {
            ids.add(id);
        }
        return ids;
    }

    public findEntities(entityType: string): void {
        // TODO: work in other entity types
        console.log(`Asked to retrieve ${entityType}, but only worlds retrieval is currently supported`);
        this._entityIds.clear();
        this.newSubscription = this._ttapiGateway.retrieveWorldIds().pipe(
            filter((valueArr: WorldIds) => valueArr !== undefined),
            mergeMap((locationIdsArr) => from(locationIdsArr)),
        ).subscribe((value) => this._entityIds.add(value));
    }
}

