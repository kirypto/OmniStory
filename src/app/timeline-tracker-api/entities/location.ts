export interface Metadata {
    [key: string]: string;
}

export interface Range {
    "low": number;
    "high": number;
}

export interface Span {
    latitude: Range;
    longitude: Range;
    altitude: Range;
    continuum: Range;
    reality: Range;
}

interface LocationData {
    id: string;
    name: string;
    description: string;
    span: Span;
    tags: string[];
    metadata: Metadata;
}

export class Location {
    _id: string;
    _name: string;
    _description: string;
    _span: Span;
    _tags: string[];
    _metadata: Metadata;

    constructor(locationData: LocationData) {
        this._id = locationData.id;
        this._name = locationData.name;
        this._description = locationData.description;
        this._span = locationData.span;
        this._tags = locationData.tags;
        this._metadata = locationData.metadata;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get span(): Span {
        return this._span;
    }

    get tags(): string[] {
        return this._tags;
    }

    get metadata(): Metadata {
        return this._metadata;
    }
}
