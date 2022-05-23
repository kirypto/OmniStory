import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {Required} from "../../util";
import {CdkDragMove} from "@angular/cdk/drag-drop";


type Position = { x: number, y: number };

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

    private _selectionLow = 25;
    private _selectionHigh = 75;

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

    public onDragMin($event: CdkDragMove): void {
        const pixelPosition = {x: $event.distance.x, y: $event.distance.y};
        const percentPosition = this.calcPercentagePosition(pixelPosition);
        console.log(`Percentage position: x=${percentPosition.x}, y=${percentPosition.y}`);
    }

    public onDragMain($event: CdkDragMove): void {
        const pixelPosition = {x: $event.distance.x, y: $event.distance.y};
        const percentPosition = this.calcPercentagePosition(pixelPosition);
        console.log(`Percentage position: x=${percentPosition.x}, y=${percentPosition.y}`);
    }

    public onDragMax($event: CdkDragMove): void {
        const pixelPosition = {x: $event.distance.x, y: $event.distance.y};
        const percentPosition = this.calcPercentagePosition(pixelPosition);
        console.log(`Percentage position: x=${percentPosition.x}, y=${percentPosition.y}`);
    }

    private get draggableAreaSize(): { width: number, height: number } {
        const nativeElement = this._draggableAreaElement.nativeElement;
        return {width: nativeElement.offsetWidth, height: nativeElement.offsetHeight};
    }

    private updateHandlePositions(): void {
        const selectionLowPercent = this.calcSelectionPercentage(this._selectionLow);
        const selectionHighPercent = this.calcSelectionPercentage(this._selectionHigh);
        const draggableAreaSize = this.draggableAreaSize;

        let pixelPositionLow: number;
        let pixelPositionHigh: number;
        if (this.isVertical) {
            pixelPositionLow = draggableAreaSize.height * selectionLowPercent;
            pixelPositionHigh = draggableAreaSize.height * selectionHighPercent;
            const pixelPositionMid = (pixelPositionLow + pixelPositionHigh) / 2;

            this._minHandleElement.nativeElement.style.transform = `translate3d(0px, ${pixelPositionLow}px, 0px)`;
            this._mainHandleElement.nativeElement.style.transform = `translate3d(0px, ${pixelPositionMid - 10}px, 0px)`;
            this._maxHandleElement.nativeElement.style.transform = `translate3d(0px, ${pixelPositionHigh - 20}px, 0px)`;
        } else {
            pixelPositionLow = draggableAreaSize.width * selectionLowPercent;
            pixelPositionHigh = draggableAreaSize.width * selectionHighPercent;
            console.log(`${pixelPositionLow} ${pixelPositionHigh}`);
        }
    }

    private calcSelectionPercentage(selectionPosition: number): number {
        const selectionPositionPercent = (selectionPosition - this._minimum) / (this._maximum - this._minimum);
        return Math.max(this._minimum, Math.min(this._maximum, selectionPositionPercent));
    }

    private calcPercentagePosition(pixelPosition: Position): Position {
        const draggableAreaSize = this.draggableAreaSize;
        return {
            x: pixelPosition.x / draggableAreaSize.width,
            y: pixelPosition.y / draggableAreaSize.height,
        };
    }
}
