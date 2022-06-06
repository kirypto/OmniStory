import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import {Required} from "../../util";
import {CdkDragMove} from "@angular/cdk/drag-drop";
import {fromEvent} from "rxjs";
import {debounceTime, throttleTime} from "rxjs/operators";
import {NumericRange} from "../../simple-types";


type XY = { x: number, y: number };
type HandleSizes = { main: number, ends: number };

@Component({
    selector: "app-range-scrollbar",
    templateUrl: "./range-scrollbar.component.html",
    styleUrls: ["./range-scrollbar.component.scss"],
})
export class RangeScrollbarComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() @Required public scrollDirection: string;
    @Input() @Required public limits: NumericRange;
    @Input() public selection: NumericRange;
    @Output() public selectionChange = new EventEmitter<NumericRange>();

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
    private _isFullyInitialized = false;

    public constructor() {
        fromEvent(window, "resize").pipe(
            throttleTime(25),
            debounceTime(25),
        ).subscribe(() => this.update(true));
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

        this.selection = {
            low: this.selection === undefined ? this.limits.low : Math.max(this.limits.low, this.selection.low),
            high: this.selection === undefined ? this.limits.high : Math.min(this.limits.high, this.selection.high),
        };

        this.updateSelectionPercentages();
    }

    public ngAfterViewInit(): void {
        this.update(true);
        this._isFullyInitialized = true;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!this._isFullyInitialized) {
            return;
        }
        this.updateSelectionPercentages();
        this.update(false);
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
        this.update(true);
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
        this.update(true);
    }

    public onDragMax($event: CdkDragMove): void {
        const desiredPercentDeltaXY = this.calcPercentageDelta($event.distance);
        const desiredPercentDelta = this.isVertical ? desiredPercentDeltaXY.y : desiredPercentDeltaXY.x;

        // Only allow zooming up to the point that the max would reach either the end or the initial min
        const maximumAllowedPercentDelta = 1.0 - this._selectionLowPercentAtDragStart;
        const minimumAllowedPercentDelta = this._selectionLowPercentAtDragStart - this._selectionHighPercentAtDragStart;
        const clampedPercentageDelta = Math.max(minimumAllowedPercentDelta, Math.min(maximumAllowedPercentDelta, desiredPercentDelta));

        this._selectionHighPercent = this._selectionHighPercentAtDragStart + clampedPercentageDelta;
        this.update(true);
    }

    private get draggableAreaSize(): { width: number, height: number } {
        const nativeElement = this._draggableAreaElement.nativeElement;
        return {width: nativeElement.offsetWidth, height: nativeElement.offsetHeight};
    }

    private updateSelectionPercentages(): void {
        this._selectionLowPercent = (this.selection.low - this.limits.low) / (this.limits.high - this.limits.low);
        this._selectionHighPercent = (this.selection.high - this.limits.low) / (this.limits.high - this.limits.low);
    }

    private update(shouldEmitChange: boolean): void {
        const handleSizes = this.updateHandleSizes();
        this.updateHandlePositions(handleSizes);
        if (shouldEmitChange) {
            const selection = {
                low: Math.max(this.limits.low, this.limits.low + (this.limits.high - this.limits.low) * this._selectionLowPercent),
                high: Math.min(this.limits.high, this.limits.low + (this.limits.high - this.limits.low) * this._selectionHighPercent),
            };
            this.selectionChange.emit(selection);
        }
    }

    private updateHandlePositions(handleSizes: HandleSizes): void {
        const draggableAreaSize = this.draggableAreaSize;

        let pixelPositionLow: number;
        let pixelPositionHigh: number;
        if (this.isVertical) {
            pixelPositionLow = draggableAreaSize.height * this._selectionLowPercent;
            pixelPositionHigh = draggableAreaSize.height * this._selectionHighPercent;

            // The automatic calculations for the positions of the handles attempts to take into account initial creation, which is why the
            // min and main handles have the same translation. However, max does not work because of the larger size of main and needs to
            // be accounted for.
            this._minHandleElement.nativeElement.style.transform = `translate3d(0px, ${pixelPositionLow}px, 0px)`;
            this._mainHandleElement.nativeElement.style.transform = `translate3d(0px, ${pixelPositionLow}px, 0px)`;
            this._maxHandleElement.nativeElement.style.transform = `translate3d(0px, ${pixelPositionHigh - handleSizes.main - 2 * handleSizes.ends}px, 0px)`;
        } else {
            pixelPositionLow = draggableAreaSize.width * this._selectionLowPercent;
            pixelPositionHigh = draggableAreaSize.width * this._selectionHighPercent;

            // Initial position stacks vertically, so the y positions need to account for that for the main and max handled. Additionally,
            // the x positions need to be adjusted as the sizes of the preceding elements (based on initial creation) are being used in the
            // automatic calculation, which throws off how it is being used here.
            this._minHandleElement.nativeElement.style.transform = `translate3d(${pixelPositionLow}px, 0px, 0px)`;
            this._mainHandleElement.nativeElement.style.transform = `translate3d(${pixelPositionLow + handleSizes.ends}px, -100%, 0px)`;
            this._maxHandleElement.nativeElement.style.transform = `translate3d(${pixelPositionHigh - handleSizes.ends}px, -200%, 0px)`;
        }
    }

    private updateHandleSizes(): HandleSizes {
        const selectedRangePercent = this._selectionHighPercent - this._selectionLowPercent;
        const draggableAreaSize = this.draggableAreaSize;
        const selectedRangePixels = (this.isVertical ? draggableAreaSize.height : draggableAreaSize.width) * selectedRangePercent;

        const endHandlePixels = Math.max(7, Math.min(35, selectedRangePixels * 0.1));
        const mainHandlePixels = selectedRangePixels - 2 * endHandlePixels;

        if (this.isVertical) {
            this._minHandleElement.nativeElement.style.height = `${endHandlePixels}px`;
            this._mainHandleElement.nativeElement.style.height = `${mainHandlePixels}px`;
            this._maxHandleElement.nativeElement.style.height = `${endHandlePixels}px`;
        } else {
            this._minHandleElement.nativeElement.style.width = `${endHandlePixels}px`;
            this._mainHandleElement.nativeElement.style.width = `${mainHandlePixels}px`;
            this._maxHandleElement.nativeElement.style.width = `${endHandlePixels}px`;
        }

        return {
            ends: endHandlePixels,
            main: mainHandlePixels,
        };
    }

    private calcPercentageDelta(pixelDelta: XY): XY {
        const draggableAreaSize = this.draggableAreaSize;
        return {
            x: pixelDelta.x / draggableAreaSize.width,
            y: pixelDelta.y / draggableAreaSize.height,
        };
    }
}
