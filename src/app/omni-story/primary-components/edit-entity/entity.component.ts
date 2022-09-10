import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {WorldId} from "../../../timeline-tracker-api/ttapi-types";

@Component({
    selector: "app-entity",
    templateUrl: "./entity.component.html",
    styleUrls: ["./entity.component.scss"],
})
export class EntityComponent implements OnInit {
    private _worldId: WorldId;
    private _entityId: WorldId;

    public constructor(
        private _route: ActivatedRoute,
    ) {
    }

    public get worldId(): string {
        return this._worldId;
    }

    public get entityId(): string {
        return this._entityId;
    }

    public ngOnInit(): void {
        const paramMap = this._route.snapshot.paramMap;
        this._worldId = paramMap.get("worldId");
        this._entityId = paramMap.get("entityId");
        console.log(`Editing ${this._worldId} -> ${this._entityId}`);
    }

}
