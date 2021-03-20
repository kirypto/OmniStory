import {Component, Input} from "@angular/core";
import {Location, Metadata, Span, Tags} from "../../types/location";

@Component({
    selector: "app-location",
    templateUrl: "./location.component.html",
    styleUrls: ["./location.component.css"]
})
export class LocationComponent {
    @Input() private _location: Location;

    constructor() {
    }

    get id(): string {
        return this._location.id;
    }

    get name(): string {
        return this._location.name;
    }

    get description(): string {
        return this._location.description;
    }

    get span(): Span {
        return this._location.span;
    }

    get tags(): Tags {
        return this._location.tags;
    }

    get metadata(): Metadata {
        return this._location.metadata;
    }
}
