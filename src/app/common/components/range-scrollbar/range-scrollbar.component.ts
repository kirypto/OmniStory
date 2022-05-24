import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {Required} from "../../util";
import {CdkDragMove} from "@angular/cdk/drag-drop";


type XY = { x: number, y: number };

@Component({
    selector: "app-range-scrollbar",
    templateUrl: "./range-scrollbar.component.html",
    styleUrls: ["./range-scrollbar.component.scss"],
})
export class RangeScrollbarComponent implements OnInit, AfterViewInit {
    @Input() @Required public scrollDirection: string;

    @ViewChild("draggableArea") private _draggableAreaElement: ElementRef;
    @ViewChild("minHandle") private _minHandleElement: ElementRef;
    @ViewChild("mainHandle") private _mainHandleElement: ElementRef;
    @ViewChild("maxHandle") private _maxHandleElement: ElementRef;
    private readonly _allowedDirections = new Set(["vertical", "horizontal"]);
    private readonly _allowedDirectionStrings = [...this._allowedDirections].join(", ");

    private _selectionLowPercent = 0.25;
    private _selectionHighPercent = 0.75;

    private _selectionLowPercentAtDragStart: number | undefined = undefined;
    private _selectionHighPercentAtDragStart: number | undefined = undefined;

    public constructor() {
    }

    public get cdkLockDirection(): string {
        return this.scrollDirection === "vertical" ? "y" : "x";
    }

    public get isVertical(): boolean {
        return this.scrollDirection === "vertical";
    }

    public ngOnInit(): void {
        if (!this._allowedDirections.has(this.scrollDirection)) {
            throw new Error(`Input 'scrollDirection' must be one of: ${this._allowedDirectionStrings}; was '${this.scrollDirection}'.`);
        }
    }

    public ngAfterViewInit(): void {
        this.updateHandlePositions();
    }

    public onDragStart(): void {
        this._selectionLowPercentAtDragStart = this._selectionLowPercent;
        this._selectionHighPercentAtDragStart = this._selectionHighPercent;
    }

    public onDragMin($event: CdkDragMove): void {
        const desiredPercentDeltaXY = this.calcPercentageDelta($event.distance);
        const desiredPercentDelta = this.isVertical ? desiredPercentDeltaXY.y : desiredPercentDeltaXY.x;

        // Only allow zooming up to the point that the min would reach either the end or the initial max
        const maximumAllowedPercentDelta = this._selectionHighPercentAtDragStart - this._selectionLowPercentAtDragStart;
        const minimumAllowedPercentDelta = -this._selectionLowPercentAtDragStart;
        const clampedPercentageDelta = Math.max(minimumAllowedPercentDelta, Math.min(maximumAllowedPercentDelta, desiredPercentDelta));

        this._selectionLowPercent = this._selectionLowPercentAtDragStart + clampedPercentageDelta;
        this.updateHandlePositions();
    }

    public onDragMain($event: CdkDragMove): void {
        const desiredPercentDeltaXY = this.calcPercentageDelta($event.distance);
        const desiredPercentDelta = this.isVertical ? desiredPercentDeltaXY.y : desiredPercentDeltaXY.x;

        // Only allow scrolling up to the point that the max or min would reach either end
        const maximumAllowedPercentDelta = 1.0 - this._selectionHighPercentAtDragStart;
        const minimumAllowedPercentDelta = -this._selectionLowPercentAtDragStart;
        const clampedPercentageDelta = Math.max(minimumAllowedPercentDelta, Math.min(maximumAllowedPercentDelta, desiredPercentDelta));

        this._selectionLowPercent = this._selectionLowPercentAtDragStart + clampedPercentageDelta;
        this._selectionHighPercent = this._selectionHighPercentAtDragStart + clampedPercentageDelta;
        this.updateHandlePositions();
    }

    public onDragMax($event: CdkDragMove): void {
        const desiredPercentDeltaXY = this.calcPercentageDelta($event.distance);
        const desiredPercentDelta = this.isVertical ? desiredPercentDeltaXY.y : desiredPercentDeltaXY.x;

        // Only allow zooming up to the point that the max would reach either the end or the initial min
        const maximumAllowedPercentDelta = 1.0 - this._selectionLowPercentAtDragStart;
        const minimumAllowedPercentDelta = this._selectionLowPercentAtDragStart - this._selectionHighPercentAtDragStart;
        const clampedPercentageDelta = Math.max(minimumAllowedPercentDelta, Math.min(maximumAllowedPercentDelta, desiredPercentDelta));

        this._selectionHighPercent = this._selectionHighPercentAtDragStart + clampedPercentageDelta;
        this.updateHandlePositions();
    }

    private get draggableAreaSize(): { width: number, height: number } {
        const nativeElement = this._draggableAreaElement.nativeElement;
        return {width: nativeElement.offsetWidth, height: nativeElement.offsetHeight};
    }

    private updateHandlePositions(): void {
        const draggableAreaSize = this.draggableAreaSize;

        let pixelPositionLow: number;
        let pixelPositionHigh: number;
        if (this.isVertical) {
            pixelPositionLow = draggableAreaSize.height * this._selectionLowPercent;
            pixelPositionHigh = draggableAreaSize.height * this._selectionHighPercent;
            const pixelPositionMid = (pixelPositionLow + pixelPositionHigh) / 2;

            this._minHandleElement.nativeElement.style.transform = `translate3d(0px, ${pixelPositionLow}px, 0px)`;
            this._mainHandleElement.nativeElement.style.transform = `translate3d(0px, ${pixelPositionMid - 10}px, 0px)`;
            this._maxHandleElement.nativeElement.style.transform = `translate3d(0px, ${pixelPositionHigh - 20}px, 0px)`;
        } else {
            pixelPositionLow = draggableAreaSize.width * this._selectionLowPercent;
            pixelPositionHigh = draggableAreaSize.width * this._selectionHighPercent;
            const pixelPositionMid = (pixelPositionLow + pixelPositionHigh) / 2;

            // Initial position stacks vertically, account for that so main and max handles are to the right of min handle instead of below
            this._minHandleElement.nativeElement.style.transform = `translate3d(${pixelPositionLow}px, 0px, 0px)`;
            this._mainHandleElement.nativeElement.style.transform = `translate3d(${pixelPositionMid}px, -100%, 0px)`;
            this._maxHandleElement.nativeElement.style.transform = `translate3d(${pixelPositionHigh}px, -200%, 0px)`;
        }
    }

    private calcPercentageDelta(pixelDelta: XY): XY {
        const draggableAreaSize = this.draggableAreaSize;
        return {
            x: pixelDelta.x / draggableAreaSize.width,
            y: pixelDelta.y / draggableAreaSize.height,
        };
    }
}
