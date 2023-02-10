import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, mergeMap} from "rxjs/operators";
import {from, Observable} from "rxjs";

import {Entity, EntityId, Event, EventId, PositionalMove, Timeline, TimelineItem, WorldId} from "@ttapi/domain/types.model";
import {TtapiGatewayService} from "@ttapi/ttapi-gateway.service";
import {RoutingComponent} from "../../abstract-components/RoutingComponent";
import {SingleEntityService} from "@ttapi/application/single-entity.service";

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
    private _entityId: EntityId;
    private _entity: Entity;
    private _timeline: Timeline;
    private readonly _eventDetails = new Map<EventId, Event>();
    private _detailedTimeline: DetailedTimelineItem[] = [];


    public constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _singleEntityService: SingleEntityService,
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
        this._entityId = paramMap.get("entityId");

        if (!this._entityId.startsWith("location") && !this._entityId.startsWith("traveler")) {
            throw new Error(`Cannot display story for entity '${this._entityId}', only locations and travelers have timelines.`);
        }

        this.newSubscription = this._singleEntityService.getTimeline(this._worldId, this._entityId)
            .subscribe((timeline: Timeline) => {
                this._timeline = timeline;
                this._eventDetails.clear();
                this.newSubscription = from(timeline).pipe(
                    filter(timelineItem => !isPositionalMove(timelineItem)),
                    mergeMap((eventId: EventId) => this._singleEntityService.getEntity(this._worldId, eventId)),
                ).subscribe((event: Event) => {
                    this._eventDetails.set(event.id, event);
                    this.updateTimeline();
                });
            });
        this.newSubscription = this._singleEntityService.getEntity(this._worldId, this._entityId)
            .subscribe((entity: Entity) => this._entity = entity);
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
