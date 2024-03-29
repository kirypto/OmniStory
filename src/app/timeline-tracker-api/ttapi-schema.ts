/* eslint-disable */
// noinspection JSUnusedGlobalSymbols

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/api/world": {
    /** Creates a new World with a generated id and returns it. */
    post: {
      responses: {
        /** Successfully created */
        201: {
          content: {
            "application/json": components["schemas"]["ExistingWorld"];
          };
        };
      };
      /**
       * *Notes*
       * - *When POSTing a World, providing an id is not required as it will
       * be generated. If one is provided it will be ignored.*
       */
      requestBody: {
        content: {
          "application/json": components["schemas"]["NewWorld"];
        };
      };
    };
  };
  "/api/worlds": {
    get: {
      parameters: {
        query: {
          /** Filters to only include Worlds which have a name equal to the specified value */
          nameIs?: string;
          /** Filters to only include Worlds which have a name that contains the specified value */
          nameHas?: string;
          /** Comma separated list of tags. Filters to only include locations which have all of the specified tags. */
          taggedAll?: string;
          /** Comma separated list of tags. Filters to only include locations which have at least one of the specified tags. */
          taggedAny?: string;
          /** Comma separated list of tags. Filters to only include locations which are only tagged with the specified tags _(or a subset of them)_. */
          taggedOnly?: string;
          /** Comma separated list of tags. Filters to only include locations which have none of the of the specified tags. */
          taggedNone?: string;
        };
      };
      responses: {
        /** Successfully retrieved */
        200: {
          content: {
            "application/json": components["schemas"]["WorldIds"];
          };
        };
      };
    };
  };
  "/api/world/{worldId}": {
    get: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
        };
      };
      responses: {
        /** Successfully retrieved */
        200: {
          content: {
            "application/json": components["schemas"]["ExistingWorld"];
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
        };
      };
      responses: {
        /** Successfully removed */
        204: never;
      };
    };
    patch: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
        };
      };
      responses: {
        /** Successfully modified */
        200: {
          content: {
            "application/json": components["schemas"]["ModifiedWorld"];
          };
        };
      };
      /**
       * *Notes*
       * - *Modifying the id is not permitted.*
       */
      requestBody: {
        content: {
          "application/json": components["schemas"]["PatchRequest"];
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
      };
    };
  };
  "/api/world/{worldId}/location": {
    /** Creates a new Location with a generated id and returns it. */
    post: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
        };
      };
      responses: {
        /** Successfully created */
        201: {
          content: {
            "application/json": components["schemas"]["ExistingLocation"];
          };
        };
      };
      /**
       * *Notes*
       * - *When POSTing a Location, providing an id is not required as it will
       * be generated. If one is provided it will be ignored.*
       */
      requestBody: {
        content: {
          "application/json": components["schemas"]["NewLocation"];
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
      };
    };
  };
  "/api/world/{worldId}/locations": {
    get: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
        };
        query: {
          /** Filters to only include Locations which have a name equal to the specified value */
          nameIs?: string;
          /** Filters to only include Locations which have a name that contains the specified value */
          nameHas?: string;
          /** Comma separated list of tags. Filters to only include locations which have all of the specified tags. */
          taggedAll?: string;
          /** Comma separated list of tags. Filters to only include locations which have at least one of the specified tags. */
          taggedAny?: string;
          /** Comma separated list of tags. Filters to only include locations which are only tagged with the specified tags _(or a subset of them)_. */
          taggedOnly?: string;
          /** Comma separated list of tags. Filters to only include locations which have none of the of the specified tags. */
          taggedNone?: string;
          /** Position object. Filters to only include locations which have a span that includes the specified position. */
          spanIncludes?: string;
          /** PositionalRange object. Filters to only include locations which have a span that intersects the specified positional range. */
          spanIntersects?: string;
        };
      };
      responses: {
        /** Successfully retrieved */
        200: {
          content: {
            "application/json": components["schemas"]["LocationIds"];
          };
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
      };
    };
  };
  "/api/world/{worldId}/location/{locationId}": {
    get: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
          locationId: components["schemas"]["LocationId"];
        };
      };
      responses: {
        /** Successfully retrieved */
        200: {
          content: {
            "application/json": components["schemas"]["ExistingLocation"];
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
          locationId: components["schemas"]["LocationId"];
        };
      };
      responses: {
        /** Successfully removed */
        204: never;
      };
    };
    patch: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
          locationId: components["schemas"]["LocationId"];
        };
      };
      responses: {
        /** Successfully modified */
        200: {
          content: {
            "application/json": components["schemas"]["ModifiedLocation"];
          };
        };
      };
      /**
       * *Notes*
       * - *Modifying the id is not permitted.*
       */
      requestBody: {
        content: {
          "application/json": components["schemas"]["PatchRequest"];
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
        locationId: components["schemas"]["LocationId"];
      };
    };
  };
  "/api/world/{worldId}/location/{locationId}/timeline": {
    get: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
          locationId: components["schemas"]["LocationId"];
        };
        query: {
          /** Comma separated list of tags. Filters timeline to include events which have all of the specified tags. */
          taggedAll?: string;
          /** Comma separated list of tags. Filters timeline to include events which have at least one of the specified tags. */
          taggedAny?: string;
          /** Comma separated list of tags. Filters timeline to include events which are only tagged with the specified tags _(or a subset of them)_. */
          taggedOnly?: string;
          /** Comma separated list of tags. Filters timeline to include events which have none of the of the specified tags. */
          taggedNone?: string;
        };
      };
      responses: {
        /** Successfully retrieved */
        200: {
          content: {
            "application/json": components["schemas"]["LocationTimeline"];
          };
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
        locationId: components["schemas"]["LocationId"];
      };
    };
  };
  "/api/world/{worldId}/traveler": {
    /** Creates a new Traveler with a generated id and returns it. */
    post: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
        };
      };
      responses: {
        /** Successfully created */
        201: {
          content: {
            "application/json": components["schemas"]["ExistingTraveler"];
          };
        };
      };
      /**
       * *Notes*
       * - *When POSTing a Traveler, providing an id is not required as it will
       * be generated. If one is provided it will be ignored.*
       */
      requestBody: {
        content: {
          "application/json": components["schemas"]["NewTraveler"];
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
      };
    };
  };
  "/api/world/{worldId}/travelers": {
    get: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
        };
        query: {
          /** Filters to only include Travelers which have a name equal to the specified value */
          nameIs?: string;
          /** Filters to only include Travelers which have a name that contains the specified value */
          nameHas?: string;
          /** Comma separated list of tags. Filters to only include travelers which have all of the specified tags. */
          taggedAll?: string;
          /** Comma separated list of tags. Filters to only include travelers which have at least one of the specified tags. */
          taggedAny?: string;
          /** Comma separated list of tags. Filters to only include travelers which are only tagged with the specified tags _(or a subset of them)_. */
          taggedOnly?: string;
          /** Comma separated list of tags. Filters to only include travelers which have none of the of the specified tags. */
          taggedNone?: string;
          /** Position object. Filters to only include travelers which visited the specified position. */
          journeyIncludes?: string;
          /** PositionalRange object. Filters to only include travelers which have visited the specified positional range. */
          journeyIntersects?: string;
        };
      };
      responses: {
        /** Successfully retrieved */
        200: {
          content: {
            "application/json": components["schemas"]["TravelerIds"];
          };
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
      };
    };
  };
  "/api/world/{worldId}/traveler/{travelerId}": {
    get: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
          travelerId: components["schemas"]["TravelerId"];
        };
      };
      responses: {
        /** Successfully retrieved */
        200: {
          content: {
            "application/json": components["schemas"]["ExistingTraveler"];
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
          travelerId: components["schemas"]["TravelerId"];
        };
      };
      responses: {
        /** Successfully removed */
        204: never;
      };
    };
    patch: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
          travelerId: components["schemas"]["TravelerId"];
        };
      };
      responses: {
        /** Successfully modified */
        200: {
          content: {
            "application/json": components["schemas"]["ModifiedTraveler"];
          };
        };
      };
      /**
       * *Notes*
       * - *Modifying the id is not permitted.*
       */
      requestBody: {
        content: {
          "application/json": components["schemas"]["PatchRequest"];
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
        travelerId: components["schemas"]["TravelerId"];
      };
    };
  };
  "/api/world/{worldId}/traveler/{travelerId}/journey": {
    /** Appends a new PositionalMove to the end of the specidied Traveler's journey. */
    post: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
          travelerId: components["schemas"]["TravelerId"];
        };
      };
      responses: {
        /** Successfully appended */
        200: {
          content: {
            "application/json": components["schemas"]["ExtendedJourneyTraveler"];
          };
        };
      };
      requestBody: {
        content: {
          "application/json": components["schemas"]["PositionalMove"];
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
        travelerId: components["schemas"]["TravelerId"];
      };
    };
  };
  "/api/world/{worldId}/traveler/{travelerId}/timeline": {
    get: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
          travelerId: components["schemas"]["TravelerId"];
        };
        query: {
          /** Comma separated list of tags. Filters timeline to include events which have all of the specified tags. */
          taggedAll?: string;
          /** Comma separated list of tags. Filters timeline to include events which have at least one of the specified tags. */
          taggedAny?: string;
          /** Comma separated list of tags. Filters timeline to include events which are only tagged with the specified tags _(or a subset of them)_. */
          taggedOnly?: string;
          /** Comma separated list of tags. Filters timeline to include events which have none of the of the specified tags. */
          taggedNone?: string;
        };
      };
      responses: {
        /** Successfully retrieved */
        200: {
          content: {
            "application/json": components["schemas"]["TravelerTimeline"];
          };
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
        travelerId: components["schemas"]["TravelerId"];
      };
    };
  };
  "/api/world/{worldId}/event": {
    /** Creates a new Event with a generated id and returns it. */
    post: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
        };
      };
      responses: {
        /** Successfully created */
        201: {
          content: {
            "application/json": components["schemas"]["ExistingEvent"];
          };
        };
      };
      /**
       * *Notes*
       * - *When POSTing an Event, providing an id is not required as it will
       * be generated. If one is provided it will be ignored.*
       * - *Either a location or a position must be included, but must not have
       * both.*
       */
      requestBody: {
        content: {
          "application/json": components["schemas"]["NewEvent"];
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
      };
    };
  };
  "/api/world/{worldId}/events": {
    get: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
        };
        query: {
          /** Filters to only include Events which have a name equal to the specified value */
          nameIs?: string;
          /** Filters to only include Events which have a name that contains the specified value */
          nameHas?: string;
          /** Comma separated list of tags. Filters to only include Events which have all of the specified tags. */
          taggedAll?: string;
          /** Comma separated list of tags. Filters to only include Events which have at least one of the specified tags. */
          taggedAny?: string;
          /** Comma separated list of tags. Filters to only include Events which are only tagged with the specified tags _(or a subset of them)_. */
          taggedOnly?: string;
          /** Comma separated list of tags. Filters to only include Events which have none of the of the specified tags. */
          taggedNone?: string;
          /** Position object. Filters to only include events which have a span that includes the specified position. */
          spanIncludes?: string;
          /** PositionalRange object. Filters to only include locations which have a span that intersects the specified positional range. */
          spanIntersects?: string;
        };
      };
      responses: {
        /** Successfully retrieved */
        200: {
          content: {
            "application/json": components["schemas"]["EventIds"];
          };
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
      };
    };
  };
  "/api/world/{worldId}/event/{eventId}": {
    get: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
          eventId: components["schemas"]["EventId"];
        };
      };
      responses: {
        /** Successfully retrieved */
        200: {
          content: {
            "application/json": components["schemas"]["ExistingEvent"];
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
          eventId: components["schemas"]["EventId"];
        };
      };
      responses: {
        /** Successfully removed */
        204: never;
      };
    };
    patch: {
      parameters: {
        path: {
          worldId: components["schemas"]["WorldId"];
          eventId: components["schemas"]["EventId"];
        };
      };
      responses: {
        /** Successfully modified */
        200: {
          content: {
            "application/json": components["schemas"]["ModifiedEvent"];
          };
        };
      };
      /**
       * *Notes*
       * - *Modifying the id is not permitted.*
       */
      requestBody: {
        content: {
          "application/json": components["schemas"]["PatchRequest"];
        };
      };
    };
    parameters: {
      path: {
        worldId: components["schemas"]["WorldId"];
        eventId: components["schemas"]["EventId"];
      };
    };
  };
}

export interface components {
  schemas: {
    /** @description A world in which locations exist, travelers visit, and events occur. */
    NewWorld: {
      /** @example The Milky Way */
      name: string;
      /** @example The Milky Way is the galaxy that includes our Solar System, with the name describing the galaxy's appearance from Earth. */
      description?: string;
      tags?: components["schemas"]["Tags"];
      attributes?: components["schemas"]["Attributes"];
    };
    ExistingWorld: {
      id: components["schemas"]["WorldId"];
    } & components["schemas"]["NewWorld"];
    ModifiedWorld: components["schemas"]["ExistingWorld"] & {
      /** @example Modified Name */
      name?: string;
    };
    /**
     * @description A place of significance that travelers can visit and events can occur at which cover a multi-dimensional area.
     * Most locations will consist of an area that spans 4 of the 5 dimensions;
     * - Ranges for dimensions 1-3 representing the physical area.
     * - A range for dimension 4 representing the time range from when it was constructed to when it will be no more.
     * - A instantaneous range for dimension 5 _(lower and higher values are the same)_.
     */
    NewLocation: {
      /** @example The Great Pyramid */
      name: string;
      /** @example A great triangular structure in Egypt constructed long ago. */
      description?: string;
      span: components["schemas"]["PositionalRange"];
      tags?: components["schemas"]["Tags"];
      attributes?: components["schemas"]["Attributes"];
    };
    ExistingLocation: {
      id: components["schemas"]["LocationId"];
    } & components["schemas"]["NewLocation"];
    ModifiedLocation: components["schemas"]["ExistingLocation"] & {
      /** @example Modified Name */
      name?: string;
    };
    /** @description A person or thing which has a journey consisting of the positions it visits. A traveler can interact with other travelers and locations via events. */
    NewTraveler: {
      /** @example Gaius Julius Caesar */
      name: string;
      /** @example Gaius Julius Caesar was a Roman general and statesman. */
      description?: string;
      journey: components["schemas"]["Journey"];
      tags?: components["schemas"]["Tags"];
      attributes?: components["schemas"]["Attributes"];
    };
    ExistingTraveler: {
      id: components["schemas"]["TravelerId"];
    } & components["schemas"]["NewTraveler"];
    ModifiedTraveler: components["schemas"]["ExistingTraveler"] & {
      /** @example Modified Name */
      name?: string;
    };
    ExtendedJourneyTraveler: components["schemas"]["ExistingTraveler"] & {
      /**
       * @example [
       *   {
       *     "position": {
       *       "latitude": -5.05,
       *       "longitude": -2.6,
       *       "altitude": 3.5,
       *       "continuum": 11.9,
       *       "reality": 0
       *     },
       *     "movement_type": "immediate"
       *   }
       * ]
       */
      journey?: components["schemas"]["PositionalMove"][];
    };
    /**
     * @description An interaction, connection, or other thing which happens across a dimensional range and optionally includes travelers and/or locations. Most events have at least one traveler, indicating that the event affected or included those travelers. Events without any travelers are supported but must still have a position or location _(for example a natural disaster in a remote area)_.
     * - An event can have zero or more locations. The locations' spans must intersect the event.
     * - An event can have zero or more travelers. The travelers' journeys must intersect the event.
     */
    NewEvent: {
      /** @example Skirmish in the market */
      name: string;
      /** @example Attacked by the Brigand Band, the civilians ran in despair until the courageous Band Of Defenders came to the rescue. */
      description?: string;
      span: components["schemas"]["PositionalRange"];
      tags?: components["schemas"]["Tags"];
      attributes?: components["schemas"]["Attributes"];
      affected_locations?: components["schemas"]["LocationIds"];
      affected_travelers?: components["schemas"]["TravelerIds"];
    };
    ExistingEvent: {
      id: components["schemas"]["EventId"];
    } & components["schemas"]["NewEvent"];
    ModifiedEvent: components["schemas"]["ExistingEvent"] & {
      /** @example Modified Name */
      name?: string;
    };
    /**
     * Format: prefixed-uuid
     * @description A unique identifier for a World
     * @example world-abad1dea-0000-4000-8000-000000000000
     */
    WorldId: string;
    /**
     * Format: prefixed-uuid
     * @description A unique identifier for a Location
     * @example location-abad1dea-0000-4000-8000-000000000000
     */
    LocationId: string;
    /**
     * Format: prefixed-uuid
     * @description A unique identifier for a Traveler
     * @example traveler-abad1dea-0000-4000-8000-000000000000
     */
    TravelerId: string;
    /**
     * Format: prefixed-uuid
     * @description A unique identifier for a Event
     * @example event-abad1dea-0000-4000-8000-000000000000
     */
    EventId: string;
    WorldIds: components["schemas"]["WorldId"][];
    LocationIds: components["schemas"]["LocationId"][];
    TravelerIds: components["schemas"]["TravelerId"][];
    EventIds: components["schemas"]["EventId"][];
    /**
     * @example [
     *   {
     *     "position": {
     *       "latitude": -5.05,
     *       "longitude": -2.6,
     *       "altitude": 3.5,
     *       "continuum": 11.9,
     *       "reality": 0
     *     },
     *     "movement_type": "immediate"
     *   },
     *   "event-abad1dea-0000-4000-8000-000000000000"
     * ]
     */
    TravelerTimeline: components["schemas"]["PositionalMoveOrEventId"][];
    LocationTimeline: components["schemas"]["EventId"][];
    /**
     * @description A sequence of positional transitions.
     * @example [
     *   {
     *     "position": {
     *       "latitude": -5.05,
     *       "longitude": -2.6,
     *       "altitude": 3.5,
     *       "continuum": 11.9,
     *       "reality": 0
     *     },
     *     "movement_type": "immediate"
     *   }
     * ]
     */
    Journey: components["schemas"]["PositionalMove"][];
    /** @description A single-dimensional range with a lower and higher value. */
    Range: {
      /**
       * Format: float
       * @example -5.1
       */
      low: number;
      /**
       * Format: float
       * @example 15.1
       */
      high: number;
    };
    /** @description A multi-dimensional range, with a range for the first 4 dimensions and an array for realities. */
    PositionalRange: {
      latitude: components["schemas"]["Range"];
      longitude: components["schemas"]["Range"];
      altitude: components["schemas"]["Range"];
      continuum: components["schemas"]["Range"];
      reality: number[];
    };
    /**
     * @description A multi-dimensional point, currently intended to support up to the 5th dimension.
     * - Dimensions 1-3 => typical coordinate system consisting of latitude, longitude, and height relative to sea level.
     * - Dimension 4 => "time" or "duration", the time that the position is tied to.
     * - Dimension 5 => "decision space" or "alternate realities" which may be jumped between.
     */
    Position: {
      /**
       * Format: float
       * @example -5.05
       */
      latitude: number;
      /**
       * Format: float
       * @example -2.6
       */
      longitude: number;
      /**
       * Format: float
       * @example 3.5
       */
      altitude: number;
      /**
       * Format: float
       * @example 11.9
       */
      continuum: number;
      /**
       * Format: int
       * @example 0
       */
      reality: number;
    };
    /**
     * @description A combination of a position and a type of transition which describe how the transition from the previous position to this position is made.
     * - 3DInterpolation => The position smoothly interpolates the position in dimensions 1 through 3. The position's 4th and 5th dimension values must be identical to the previous point.
     * - InstantaneousJump => The earlier position is used to "infill" all possible queries between two points in a sequence until the latter position is reached, at which time the latter position is instantaneously used.
     */
    PositionalMove: {
      position: components["schemas"]["Position"];
      /**
       * @example immediate
       * @enum {string}
       */
      movement_type: "immediate" | "interpolated";
    };
    /**
     * @description Generic attribute key-value map consisting of string keys and json data values.
     * - Attributes keys must be contain only alphanumeric, underscore, and dash characters.
     * - Attributes values can be any json.
     *
     * @example {
     *   "key1": "Value A",
     *   "key2": {
     *     "key3": "Value B",
     *     "key4": [
     *       4.2,
     *       false
     *     ]
     *   }
     * }
     */
    Attributes: { [key: string]: unknown };
    /**
     * @description Alpha-numeric string to allow custom categorization for Travelers, Locations, and Events.
     * @example important
     */
    Tag: string;
    Tags: components["schemas"]["Tag"][];
    PositionalMoveOrEventId:
      | components["schemas"]["PositionalMove"]
      | components["schemas"]["EventId"];
    PatchRequest: components["schemas"]["PatchDocument"][];
    /**
     * @description A JSONPatch document as defined by RFC 6902.
     * @example {
     *   "op": "replace",
     *   "path": "/name",
     *   "value": "Modified Name"
     * }
     */
    PatchDocument: {
      /**
       * @description The operation to be performed.
       * @example add
       * @enum {string}
       */
      op: "add" | "remove" | "replace" | "move" | "copy" | "test";
      /** @description The path to the sub-resource to modify relative to the main resource. */
      path: string;
      /** @description The value to be used within the operations. */
      value?: { [key: string]: unknown };
      /** @description A string containing a JSON Pointer value. */
      from?: string;
    };
  };
}

export interface operations {}

export interface external {}
