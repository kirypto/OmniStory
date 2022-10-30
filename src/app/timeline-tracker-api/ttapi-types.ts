import {components} from "./ttapi-schema";
/*
The following command will generate the ttapi-schema.ts file according to the Timeline Tracker API Specification:
    npx openapi-typescript .\src\assets\ttapi-specification\apiSpecification.json --output .\src\app\timeline-tracker-api\ttapi-schema.ts
Note: After regenerating, "tslint:disable" should be re-added as the first line.
 */


export type WorldIds = components["schemas"]["WorldIds"];
export type WorldId = components["schemas"]["WorldId"];
export type World = components["schemas"]["ExistingWorld"];

export type LocationIds = components["schemas"]["LocationIds"];
export type LocationId = components["schemas"]["LocationId"];
export type Location = components["schemas"]["ExistingLocation"];

export type TravelerId = components["schemas"]["TravelerId"];
export type Traveler = components["schemas"]["ExistingTraveler"];

export type EventId = components["schemas"]["EventId"];
export type Event = components["schemas"]["ExistingEvent"];

export type EntityId = WorldId | LocationId | TravelerId | EventId;
export type Entity = World | Location | Traveler | Event;

export type Span = components["schemas"]["PositionalRange"];
export type Journey = components["schemas"]["Journey"];

export type PatchRequest = components["schemas"]["PatchRequest"];
