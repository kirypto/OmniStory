import {AfterViewInit, Component, ElementRef, ViewChild} from "@angular/core";
import {fromEvent, Observable, Subject} from "rxjs";
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

interface MapLabel {
    text: string;
    colour?: string;
    fontSize?: number;
    x: number;
    y: number;
}

export interface Area {
    x: NumericRange;
    y: NumericRange;
}

export interface CanvasAspectRatio {
    verticalUnitsPerHorizontal: number;
    horizontalUnitsPerVertical: number;
}

function convertToCanvasRange(inputRange: NumericRange, input: number, outputRange: NumericRange): number {
    const inputPercent = (input - inputRange.low) / (inputRange.high - inputRange.low);
    return (outputRange.high - outputRange.low) * inputPercent + outputRange.low;
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
    private _viewArea: Area = {x: {low: 0, high: 100}, y: {low: 0, high: 100}};
    private _onAspectRatioChanged = new Subject<CanvasAspectRatio>();

    public constructor() {
        fromEvent(window, "resize").subscribe(() => {
            this.redraw();
            this._onAspectRatioChanged.next(this.aspectRatio);
        });
    }

    public set mapImages(images: MapImage[]) {
        this._mapImages = images;
        this.redraw();
    }

    public set mapLabel(labels: MapLabel[]) {
        this._mapLabels = labels;
        this.redraw();
    }

    public set viewArea(viewArea: Area) {
        this._viewArea = viewArea;
        this.redraw();
    }

    public get aspectRatio(): CanvasAspectRatio {
        return {
            verticalUnitsPerHorizontal: this._mapCanvas.offsetHeight / this._mapCanvas.offsetWidth,
            horizontalUnitsPerVertical: this._mapCanvas.offsetWidth / this._mapCanvas.offsetHeight,
        };
    }

    public get onAspectRatioChanged(): Observable<CanvasAspectRatio> {
        return this._onAspectRatioChanged;
    }

    public ngAfterViewInit(): void {
        this._mapCanvas = this._mapCanvasElement.nativeElement;
        this._mapCanvasCtx = this._mapCanvas.getContext("2d");
        setTimeout(() => this.updateCanvasSize(), 1); // update canvas size as soon as element size settles
    }

    private get canvasArea(): Area {
        return {
            x: {low: 0, high: this._mapCanvas.offsetWidth},
            y: {low: 0, high: this._mapCanvas.offsetHeight},
        };
    }

    private redraw(): void {
        this.updateCanvasSize();
        this._mapCanvasCtx.clearRect(0, 0, this._mapCanvas.width, this._mapCanvas.height);
        this.drawMapImages();
        this.drawMapLabels();
        this.drawLatLon();
    }

    private updateCanvasSize(): void {
        this._mapCanvas.width = this._mapCanvas.offsetWidth;
        this._mapCanvas.height = this._mapCanvas.offsetHeight;
    }

    private drawMapImages(): void {
        for (const mapImage of this._mapImages) {
            const pixelXLow = convertToCanvasRange(this._viewArea.x, mapImage.x.low, this.canvasArea.x);
            const pixelXHigh = convertToCanvasRange(this._viewArea.x, mapImage.x.high, this.canvasArea.x);
            const pixelYLow = convertToCanvasRange(this._viewArea.y, mapImage.y.low, this.canvasArea.y);
            const pixelYHigh = convertToCanvasRange(this._viewArea.y, mapImage.y.high, this.canvasArea.y);
            this._mapCanvasCtx.drawImage(mapImage.source,
                pixelXLow, pixelYLow,
                pixelXHigh - pixelXLow, pixelYHigh - pixelYLow);
        }
    }

    private drawMapLabels(): void {
        this._mapCanvasCtx.save();
        for (const mapLabel of this._mapLabels) {
            this._mapCanvasCtx.font = `${mapLabel.fontSize || 12}px Arial`;
            this._mapCanvasCtx.fillStyle = mapLabel.colour || "#000";
            const pixelX = convertToCanvasRange(this._viewArea.x, mapLabel.x, this.canvasArea.x);
            const pixelY = convertToCanvasRange(this._viewArea.y, mapLabel.y, this.canvasArea.y);
            this._mapCanvasCtx.fillText(mapLabel.text, pixelX, pixelY);
        }
        this._mapCanvasCtx.restore();
    }

    private drawLatLon(): void {
        this._mapCanvasCtx.save();
        this._mapCanvasCtx.font = `12px Arial`;
        this._mapCanvasCtx.fillStyle = "#FFF";
        this._mapCanvasCtx.textAlign = "center";

        const lonXPos = this.canvasArea.x.high / 2;
        this._mapCanvasCtx.fillText("-  longitude  +", lonXPos, this.canvasArea.y.high - 5);

        const latYPos = this.canvasArea.y.high / 2;
        this._mapCanvasCtx.rotate(-Math.PI / 2);
        this._mapCanvasCtx.fillText("-  latitude  +", -latYPos, this.canvasArea.x.high);

        this._mapCanvasCtx.restore();
    }
}
