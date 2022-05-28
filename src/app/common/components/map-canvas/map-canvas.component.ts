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

export interface MapLabel {
    text: string;
    colour?: string;
    fontSize?: number;
    x: number;
    y: number;
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
    private _mapLabels: MapLabel[] = [];

    public constructor() {
        fromEvent(window, "resize").subscribe(() => this.redraw());
    }

    public set mapImages(images: MapImage[]) {
        this._mapImages = images;
        this.redraw();
    }

    public set mapLabel(labels: MapLabel[]) {
        this._mapLabels = labels;
        this.redraw();
    }

    public ngAfterViewInit(): void {
        this._mapCanvas = this._mapCanvasElement.nativeElement;
        this._mapCanvasCtx = this._mapCanvas.getContext("2d");
        setTimeout(() => this.updateCanvasSize(), 1); // update canvas size as soon as element size settles
    }

    private redraw(): void {
        this.updateCanvasSize();
        this._mapCanvasCtx.clearRect(0, 0, this._mapCanvas.width, this._mapCanvas.height);
        this.drawMapImages();
        this.drawMapLabels();
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

    private drawMapLabels(): void {
        for (const mapLabel of this._mapLabels) {
            this._mapCanvasCtx.font = `${mapLabel.fontSize || 12}px Arial`;
            this._mapCanvasCtx.fillStyle = mapLabel.colour || "#000";
            this._mapCanvasCtx.fillText(mapLabel.text, mapLabel.x, mapLabel.y);
        }
    }
}
