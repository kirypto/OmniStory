import {IdentifiedEntity} from "./IdentifiedEntity";

export interface Metadata extends Map<string, string> {}

export interface Tags extends Set<string> {}


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

export interface LocationData {
    id: string;
    name: string;
    description: string;
    span: Span;
    tags: Tags;
    metadata: Metadata;
}

function validateNeitherNullNorUndefined<T>(name: string, obj: T): T {
    if (obj === null || obj === undefined) {
        throw new Error(`'${name}' was cannot be null or undefined`);
    }
    return obj;
}

const locationIdRegExp = new RegExp("^location-\d{8}-\d{4}-\d{4}-\d{4}-\d{12}$").compile();

function validateLocationId(name: string, locationId: string): string {
    validateNeitherNullNorUndefined(name, locationId);
    if (!locationIdRegExp.test(locationId)) {
        throw new Error(`'${name}' must be a string starting with 'location-' with a uuid following`);
    }
    return locationId;
}

export class Location implements IdentifiedEntity {
    _id: string;
    _name: string;
    _description: string;
    _span: Span;
    _tags: Tags;
    _metadata: Metadata;

    constructor(locationData: LocationData) {
        this._id = validateLocationId("id", locationData.id);
        this._name = validateNeitherNullNorUndefined("name", locationData.name);
        this._description = validateNeitherNullNorUndefined("description", locationData.description);
        this._span = validateNeitherNullNorUndefined("span", locationData.span);
        this._tags = validateNeitherNullNorUndefined("tags", locationData.tags);
        this._metadata = validateNeitherNullNorUndefined("metadata", locationData.metadata);
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

    get tags(): Tags {
        return this._tags;
    }

    get metadata(): Metadata {
        return this._metadata;
    }
}
