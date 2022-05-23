import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {Required} from "../../util";
import {CdkDragMove} from "@angular/cdk/drag-drop";

@Component({
    selector: "app-range-scrollbar",
    templateUrl: "./range-scrollbar.component.html",
    styleUrls: ["./range-scrollbar.component.scss"],
})
export class RangeScrollbarComponent implements OnInit {
    @Input() @Required public scrollDirection: string;

    @ViewChild("draggableArea") draggableAreaElement: ElementRef;
    private readonly _allowedDirections = new Set(["vertical", "horizontal"]);
    private readonly _allowedDirectionStrings = [...this._allowedDirections].join(", ");

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

    public onDrag($event: CdkDragMove): void {
        const pixelPosition = {x: $event.distance.x, y: $event.distance.y};
        const percentPosition = this.calcPercentagePosition(pixelPosition);
        console.log(`Percentage position: x=${percentPosition.x}, y=${percentPosition.y}`);
    }

    private get draggableAreaSize(): { width: number, height: number } {
        const nativeElement = this.draggableAreaElement.nativeElement;
        return {width: nativeElement.offsetWidth, height: nativeElement.offsetHeight};
    }

    private calcPercentagePosition(pixelPosition: { x: number, y: number }): { x: number, y: number } {
        const draggableAreaSize = this.draggableAreaSize;
        return {
            x: pixelPosition.x / draggableAreaSize.width,
            y: pixelPosition.y / draggableAreaSize.height,
        };
    }
}