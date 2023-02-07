import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, mergeMap} from "rxjs/operators";
import {from, Observable} from "rxjs";

import {Entity, EntityId, Event, EventId, PositionalMove, Timeline, TimelineItem, WorldId} from "@ttapi/domain/types.model";
import {TtapiGatewayService} from "../../../timeline-tracker-api/ttapi-gateway.service";
import {RoutingComponent} from "../../abstract-components/RoutingComponent";

function isPositionalMove(timelineItem: TimelineItem): boolean {
    const itemAsPositionalMove = timelineItem as PositionalMove;
    return !!itemAsPositionalMove.position;
}

interface DetailedTimelineItem {
    type: "movement" | "event";
    title: string;
    details?: string;
    eventId?: EventId;
}

@Component({
    selector: "app-story",
    templateUrl: "./story.component.html",
    styleUrls: ["./story.component.scss"],
})
export class StoryComponent extends RoutingComponent implements OnInit {
    private _worldId: WorldId;
    private _name: EntityId;
    private _entity: Entity;
    private _timeline: Timeline;
    private readonly _eventDetails = new Map<EventId, Event>();
    private _detailedTimeline: DetailedTimelineItem[] = [];


    public constructor(
        private _route: ActivatedRoute,
        private _ttapiGateway: TtapiGatewayService,
        private _router: Router,
    ) {
        super();
    }

    public get worldId(): string {
        return this._worldId;
    }

    public get name(): string {
        return this._entity?.name || "";
    }

    public get timeline(): DetailedTimelineItem[] {
        return this._detailedTimeline;
    }

    public ngOnInit(): void {
        this.loadEntity();
        this.newSubscription = this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
        ).subscribe(() => this.loadEntity());
    }

    private loadEntity(): void {
        const paramMap = this._route.snapshot.paramMap;
        this._worldId = paramMap.get("worldId");
        this._name = paramMap.get("entityId");

        let fetchTimelineObservable: Observable<Timeline>;
        let fetchEntityObservable: Observable<Entity>;
        if (this._name.startsWith("location")) {
            const args = {worldId: this._worldId, locationId: this._name};
            fetchTimelineObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/location/{locationId}/timeline", "get", args);
            fetchEntityObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/location/{locationId}", "get", args);
        } else if (this._name.startsWith("traveler")) {
            const args = {worldId: this._worldId, travelerId: this._name};
            fetchTimelineObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/traveler/{travelerId}/timeline", "get", args);
            fetchEntityObservable = this._ttapiGateway.fetchOld("/api/world/{worldId}/traveler/{travelerId}", "get", args);
        } else {
            throw new Error(`Cannot edit entity '${this._name}', unsupported entity type`);
        }

        this.newSubscription = fetchTimelineObservable.subscribe((timeline: Timeline) => {
            this._timeline = timeline;
            this._eventDetails.clear();
            this.newSubscription = from(timeline).pipe(
                filter(timelineItem => !isPositionalMove(timelineItem)),
                mergeMap((eventId: EventId) => this._ttapiGateway.fetchOld("/api/world/{worldId}/event/{eventId}", "get", {
                    worldId: this._worldId, eventId,
                })),
            ).subscribe((event: Event) => {
                this._eventDetails.set(event.id, event);
                this.updateTimeline();
            });
        });
        this.newSubscription = fetchEntityObservable.subscribe((entity: Entity) => this._entity = entity);
    }

    private updateTimeline(): void {
        this._detailedTimeline = [];
        for (const timelineElement of this._timeline) {
            if (isPositionalMove(timelineElement)) {
                const positionalMove = timelineElement as PositionalMove;
                this._detailedTimeline.push({
                    type: "movement",
                    title: `Traveled to (${positionalMove.position.latitude}, ${positionalMove.position.longitude})
                            on day ${positionalMove.position.continuum}
                            ${positionalMove.movement_type === "immediate" ? "(via instantaneous transport)" : ""}`,
                });
            } else {
                const eventId = timelineElement as EventId;
                if (this._eventDetails.has(eventId)) {
                    const event = this._eventDetails.get(eventId);
                    this._detailedTimeline.push({
                        type: "event",
                        title: `${event.name}`,
                        details: event.description,
                        eventId,
                    });
                }
            }
        }
    }
}
