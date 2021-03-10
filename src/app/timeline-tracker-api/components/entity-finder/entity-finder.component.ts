import {Component, Injectable, OnInit} from "@angular/core";
import {LocationGatewayService} from "../../gateways/location-gateway.service";
import {from} from "rxjs";
import {filter, map, mergeMap} from "rxjs/operators";
import {Location} from "../../entities/location";

@Component({
    selector: "app-entity-finder",
    templateUrl: "./entity-finder.component.html",
    styleUrls: ["./entity-finder.component.css"]
})
@Injectable({providedIn: "root"})
export class EntityFinderComponent implements OnInit {
    private _locationIds: Set<string> = new Set([
        "location-c86da392-86e7-4405-911c-799642a62eb7", // Uxphon, no Infinity
        // "location-a84afc0d-aaab-466c-9ae3-b5b74a5588e6", // Jinersa, has Infinity
    ]);
    private _locations: Map<string, Location> = new Map<string, Location>();

    constructor(
        private _locationGateway: LocationGatewayService
    ) {
    }

    ngOnInit(): void {
        from(this._locationIds)
            .pipe(
                map((locationId) => this._locationGateway.getLocation(locationId)),
                mergeMap((locationObservable) => locationObservable),
                filter((value) => value !== undefined),
            )
            .subscribe((location) => this._locations.set(location.id, location));
    }

    get locationNamesById(): Map<string, string> {
        const namesById = new Map<string, string>();
        for (const location of this._locations.values()) {
            namesById.set(location.id, location.name);
        }
        console.dir(namesById);
        return namesById;
    }
}
