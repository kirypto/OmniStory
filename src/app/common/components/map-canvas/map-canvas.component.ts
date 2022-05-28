import {AfterViewInit, Component, ElementRef, ViewChild} from "@angular/core";
import {fromEvent} from "rxjs";
import {NumericRange} from "../../simple-types";

interface Canvas {
    width: number;
    height: number;
    offsetWidth: number;
    offsetHeight: number;

    getContext(ctx: string): CanvasRenderingContext2D;
}

export interface MapImage {
    source: CanvasImageSource;
    x: NumericRange;
    y: NumericRange;
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
    private _mapImages: MapImage[] = [];

    public constructor() {
        fromEvent(window, "resize").subscribe(() => this.updateCanvasSize());
    }

    public set mapImages(images: MapImage[]) {
        this._mapImages = images;
        this.redraw();
    }

    public ngAfterViewInit(): void {
        this._mapCanvas = this._mapCanvasElement.nativeElement;
        this._mapCanvasCtx = this._mapCanvas.getContext("2d");
        setTimeout(() => this.updateCanvasSize(), 1); // update canvas size as soon as element size settles
    }

    public clear(): void {
        // this._mapCanvasCtx.clearRect(0, 0, this._mapCanvas.width, this._mapCanvas.height);
    }

    public fillText(text: string, x: number, y: number, fontSize: number = 20): void {
        // this._mapCanvasCtx.font = `${fontSize}px Arial`;
        // this._mapCanvasCtx.fillStyle = "#d3d3d3";
        // this._mapCanvasCtx.fillText(text, x, y);
    }

    private redraw(): void {
        this.drawMapImages();
    }

    private updateCanvasSize(): void {
        this._mapCanvas.width = this._mapCanvas.offsetWidth;
        this._mapCanvas.height = this._mapCanvas.offsetHeight;
    }

    private drawMapImages(): void {
        for (const mapImage of this._mapImages) {
            this._mapCanvasCtx.drawImage(mapImage.source,
                mapImage.x.low, mapImage.y.low,
                mapImage.x.high - mapImage.x.low, mapImage.y.high - mapImage.y.low);
        }
    }
}
