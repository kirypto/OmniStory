import {AfterViewInit, Component, ElementRef, ViewChild} from "@angular/core";

interface Canvas {
    width: number;
    height: number;

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
    }

    public ngAfterViewInit(): void {
        this._mapCanvas = this._mapCanvasElement.nativeElement;
        this._mapCanvasCtx = this._mapCanvas.getContext("2d");
    }

    public clear(): void {
        this._mapCanvasCtx.clearRect(0, 0, this._mapCanvas.width, this._mapCanvas.height);
    }

    public fillText(text: string, x: number, y: number): void {
        this._mapCanvasCtx.font = "20px Arial";
        this._mapCanvasCtx.fillStyle = "#d3d3d3";
        this._mapCanvasCtx.fillText(text, x, y);
    }
}
