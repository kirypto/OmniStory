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

    private _minimum = 0.0;
    private _maximum = 100.0;

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
        if (!this.isVertical) {
            // Initial position stacks vertically, main and max handles to be to the right of the min instead of below
            this._mainHandleElement.nativeElement.style.transform = "translate3d(10px, -100%, 0px)";
            this._maxHandleElement.nativeElement.style.transform = "translate3d(20px, -200%, 0px)";
        }

        this.updateHandlePositions();
    }

    public onDragStart(): void {
        this._selectionLowPercentAtDragStart = this._selectionLowPercent;
        this._selectionHighPercentAtDragStart = this._selectionHighPercent;
    }

    public onDragMin($event: CdkDragMove): void {
        // const pixelPosition = {x: $event.distance.x, y: $event.distance.y};
        // const percentPosition = this.calcPercentageDelta(pixelPosition);
        // console.log(`Percentage position: x=${percentPosition.x}, y=${percentPosition.y}`);
    }

    public onDragMain($event: CdkDragMove): void {
        // const pixelPosition = {x: $event.distance.x, y: $event.distance.y};
        // const percentPosition = this.calcPercentageDelta(pixelPosition);
        const percentageDelta = this.calcPercentageDelta($event.distance);
        console.log(`Distance x=${percentageDelta.x}, y=${percentageDelta.y}`);
    }

    public onDragMax($event: CdkDragMove): void {
        // const pixelPosition = {x: $event.distance.x, y: $event.distance.y};
        // const percentPosition = this.calcPercentageDelta(pixelPosition);
        // console.log(`Percentage position: x=${percentPosition.x}, y=${percentPosition.y}`);
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
            console.log(`${pixelPositionLow} ${pixelPositionHigh}`);
        }
    }

    private calcSelectionPercentage(selectionPosition: number): number {
        const selectionPositionPercent = (selectionPosition - this._minimum) / (this._maximum - this._minimum);
        return Math.max(this._minimum, Math.min(this._maximum, selectionPositionPercent));
    }

    private calcPercentageDelta(pixelDelta: XY): XY {
        const draggableAreaSize = this.draggableAreaSize;
        return {
            x: pixelDelta.x / draggableAreaSize.width,
            y: pixelDelta.y / draggableAreaSize.height,
        };
    }
}
