import {Injectable} from "@angular/core";
import {TtapiGateway} from "@ttapi/domain/ttapi-gateway.model";
import {Observable} from "rxjs";
import {EventIds, LocationIds, TravelerIds, WorldId, WorldIds} from "@ttapi/domain/types.model";

@Injectable({
  providedIn: 'root'
})
export class MultipleEntityService {
  public constructor(private _ttapiGateway: TtapiGateway) {
  }

  public getWorlds(): Observable<WorldIds> {
    return this._ttapiGateway.fetch("/api/worlds", "get", {}, {}, null);
  }

  public getWorldEntities(worldId: WorldId, entityType: "Location" | "Traveler" | "Event"): Observable<LocationIds | TravelerIds | EventIds> {
    if (entityType === "Location") {
      return this._ttapiGateway.fetch("/api/world/{worldId}/locations", "get", {worldId}, {}, null);
    } else if (entityType === "Traveler") {
      return this._ttapiGateway.fetch("/api/world/{worldId}/travelers", "get", {worldId}, {}, null);
    } else if (entityType === "Event") {
      return this._ttapiGateway.fetch("/api/world/{worldId}/events", "get", {worldId}, {}, null);
    } else {
      throw new Error(`Unsupported entity type '${entityType}'`);
    }
  }
}
