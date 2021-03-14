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
    private _selectedEntity: IdentifiedEntity;

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

    get selectedLocation(): Location | undefined {
        return this._selectedEntity instanceof Location ? this._selectedEntity : undefined;
    }

    findEntities(entityType: string): void {
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

    selectEntity(entityId: string): void {
        this._selectedEntity = this._entitiesById.get(entityId);
        this._entitiesById.clear();
    }

    private findLocations(): Observable<Location> {
        return this._locationGateway.getLocationIds().pipe(
            mergeMap((locationIdsArr) => from(locationIdsArr)),
            map((locationId) => this._locationGateway.getLocation(locationId)),
            mergeMap((locationObservable) => locationObservable),
        );
    }
}

