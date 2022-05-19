import {IdentifiedEntity} from "./identified-entity";

export interface Metadata extends Map<string, string> {}

export interface Tags extends Set<string> {}


export interface Range {
    low: number;
    high: number;
}

export interface SpanData {
    latitude: Range;
    longitude: Range;
    altitude: Range;
    continuum: Range;
    reality: number[];
}

export interface SpanReal {
    latitude: Range;
    longitude: Range;
    altitude: Range;
    continuum: Range;
    reality: Set<number>;
}

export interface LocationData {
    id: string;
    name: string;
    description: string;
    span: SpanData;
    tags: string[];
    metadata: { [key: string]: string };
}

function validateNeitherNullNorUndefined<T>(name: string, obj: T): T {
    if (obj === null || obj === undefined) {
        throw new Error(`'${name}' was cannot be null or undefined`);
    }
    return obj;
}

const locationIdRegExp = new RegExp("^location-\\d{8}-\\d{4}-\\d{4}-\\d{4}-\\d{12}$");

function validateLocationId(name: string, locationId: string): string {
    validateNeitherNullNorUndefined(name, locationId);
    if (!locationIdRegExp.test(locationId)) {
        throw new Error(`'${name}' must be a string starting with 'location-' with a uuid following`);
    }
    return locationId;
}

function toSpan(spanData: SpanData): SpanReal {
    return {
        latitude: spanData.latitude,
        longitude: spanData.longitude,
        altitude: spanData.altitude,
        continuum: spanData.continuum,
        reality: new Set<number>(spanData.reality)
    };
}

export class Location implements IdentifiedEntity {
    _id: string;
    _name: string;
    _description: string;
    _span: SpanReal;
    _tags: Tags;
    _metadata: Metadata;

    constructor(locationData: LocationData) {
        this._id = validateLocationId("id", locationData.id);
        this._name = validateNeitherNullNorUndefined("name", locationData.name);
        this._description = validateNeitherNullNorUndefined("description", locationData.description);
        this._span = toSpan(validateNeitherNullNorUndefined("span", locationData.span));
        this._tags = new Set<string>(validateNeitherNullNorUndefined("tags", locationData.tags));
        this._metadata = new Map<string, string>(Object.entries(validateNeitherNullNorUndefined("metadata", locationData.metadata)));
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

    get span(): SpanReal {
        return this._span;
    }

    get tags(): Tags {
        return this._tags;
    }

    get metadata(): Metadata {
        return this._metadata;
    }

    public equals(other: any): boolean {
        return other instanceof Location
            && this._id === other._id
            && this._name === other._name
            && this._description === other._description
            && this._span.latitude.low === other._span.latitude.low
            && this._span.latitude.high === other._span.latitude.high
            && this._span.longitude.low === other._span.longitude.low
            && this._span.longitude.high === other._span.longitude.high
            && this._span.altitude.low === other._span.altitude.low
            && this._span.altitude.high === other._span.altitude.high
            && this._span.continuum.low === other._span.continuum.low
            && this._span.continuum.high === other._span.continuum.high
            && this._span.reality.size === other._span.reality.size
            && [...this._span.reality].every(tag => other._span.reality.has(tag))
            && this._tags.size === other._tags.size
            && [...this._tags].every(tag => other._tags.has(tag))
            && this._metadata.size === other._metadata.size
            && [...this._metadata.keys()].every(metadataKey => other._metadata.has(metadataKey))
            && [...this._metadata.keys()].every(metadataKey => this._metadata.get(metadataKey) === other._metadata.get(metadataKey))
            ;
    }

    public getData(): LocationData {
        const rawMetadata = {};
        for (const [key, val] of this._metadata) {
            rawMetadata[key] = val;
        }
        return {
            id: this._id,
            name: this._name,
            description: this._description,
            span: {
                latitude: {low: this._span.latitude.low, high: this._span.latitude.high},
                longitude: {low: this._span.longitude.low, high: this._span.longitude.high},
                altitude: {low: this._span.altitude.low, high: this._span.altitude.high},
                continuum: {low: this._span.continuum.low, high: this._span.continuum.high},
                reality: [...this._span.reality].sort((n1, n2) => n1 - n2)
            },
            tags: [...this._tags].sort((tag1: string, tag2: string) => tag1.localeCompare(tag2)),
            metadata: rawMetadata,
        };
    }
}
