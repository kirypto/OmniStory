import {Component, Injectable} from "@angular/core";
import {LocationGatewayService} from "../../gateways/location-gateway.service";
import {from, Observable} from "rxjs";
import {filter, map, mergeMap} from "rxjs/operators";
import {Location} from "../../entities/location";
import {IdentifiedEntity} from "../../entities/IdentifiedEntity";

@Component({
    selector: "app-entity-finder",
    templateUrl: "./entity-finder.component.html",
    styleUrls: ["./entity-finder.component.css"]
})
@Injectable({providedIn: "root"})
export class EntityFinderComponent {
    private _entitiesById: Map<string, IdentifiedEntity> = new Map<string, IdentifiedEntity>();

    constructor(
        private _locationGateway: LocationGatewayService
    ) {
    }

    get entityIdsAndNames(): Map<string, string> {
        const namesById = new Map<string, string>();
        for (const entity of this._entitiesById.values()) {
            if (entity instanceof Location) {
                namesById.set(entity.id, entity.name);
            }
        }
        console.dir(namesById);
        return namesById;
    }

    findEntities(entityType: string): void {
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

    selectEntity(entityId: string): void {
        alert(`You selected ${entityId}`);
    }

    private findLocations(): Observable<Location> {
        return from([
            "location-c86da392-86e7-4405-911c-799642a62eb7", // Uxphon, no Infinity
            // "location-a84afc0d-aaab-466c-9ae3-b5b74a5588e6", // Jinersa, has Infinity
        ]).pipe(
            map((locationId) => this._locationGateway.getLocation(locationId)),
            mergeMap((locationObservable) => locationObservable),
        );
    }
}

