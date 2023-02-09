import {Injectable} from "@angular/core";
import {TtapiGateway} from "@ttapi/domain/ttapi-gateway.model";
import {EntityId, Traveler, World, WorldId} from "@ttapi/domain/types.model";
import {Observable} from "rxjs";


@Injectable({
    providedIn: "root",
})
export class SingleEntityService {
    public constructor(private _ttapiGateway: TtapiGateway) {
    }

    public getEntity(worldId: WorldId, entityId?: EntityId): Observable<World | Location | Traveler | Event> {
        if (!entityId) {
            return this._ttapiGateway.fetch(
                "/api/world/{worldId}", "get", {worldId}, {}, null);
        } else if (entityId.startsWith("location")) {
            return this._ttapiGateway.fetch(
                "/api/world/{worldId}/location/{locationId}", "get", {worldId, locationId: entityId}, {}, null);
        } else if (entityId.startsWith("traveler")) {
            return this._ttapiGateway.fetch(
                "/api/world/{worldId}/traveler/{travelerId}", "get", {worldId, travelerId: entityId}, {}, null);
        } else if (entityId.startsWith("event")) {
            return this._ttapiGateway.fetch(
                "/api/world/{worldId}/event/{eventId}", "get", {worldId, eventId: entityId}, {}, null);
        } else {
            throw new Error(`Unsupported entity type '${entityId}'`);
        }
    }
}
