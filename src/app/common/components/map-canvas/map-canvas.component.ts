import {AfterViewInit, Component, ElementRef, ViewChild} from "@angular/core";
import {fromEvent} from "rxjs";

interface Canvas {
    width: number;
    height: number;
    offsetWidth: number;
    offsetHeight: number;

    getContext(ctx: string): CanvasRenderingContext2D;
}

@Component({
    selector: "app-map-canvas",
    templateUrl: "./map-canvas.component.html",
    styleUrls: ["./map-canvas.component.css"],
})
export class MapCanvasComponent implements AfterViewInit {
    @ViewChild("mapCanvas") private _mapCanvasElement: ElementRef;
    private _mapCanvas: Canvas;
    private _mapCanvasCtx: CanvasRenderingContext2D;

    public constructor() {
        fromEvent(window, "resize").subscribe(() => this.updateCanvasSize());
    }

    public ngAfterViewInit(): void {
        this._mapCanvas = this._mapCanvasElement.nativeElement;
        this._mapCanvasCtx = this._mapCanvas.getContext("2d");
        this.updateCanvasSize();
    }

    public clear(): void {
        this._mapCanvasCtx.clearRect(0, 0, this._mapCanvas.width, this._mapCanvas.height);
    }

    public fillText(text: string, x: number, y: number, fontSize: number = 20): void {
        this._mapCanvasCtx.font = `${fontSize}px Arial`;
        this._mapCanvasCtx.fillStyle = "#d3d3d3";
        this._mapCanvasCtx.fillText(text, x, y);
    }

    private updateCanvasSize(): void {
        this._mapCanvas.width = this._mapCanvas.offsetWidth;
        this._mapCanvas.height = this._mapCanvas.offsetHeight;
    }
}
