import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from "@angular/core";
import {fromEvent, Observable, Subject} from "rxjs";
import {NumericRange} from "../../numeric-range";

interface Canvas {
    width: number;
    height: number;
    offsetWidth: number;
    offsetHeight: number;

    getContext(ctx: string): CanvasRenderingContext2D;
}

export interface MapImage {
    source: CanvasImageSource;
    latitude: NumericRange;
    longitude: NumericRange;
}

interface MapLabel {
    text: string;
    colour?: string;
    fontSize?: number;
    latitude: number;
    longitude: number;
}

export interface MapArea {
    latitude: NumericRange;
    longitude: NumericRange;
}

export interface CanvasAspectRatio {
    latUnitsPerLonUnit: number;
    lonUnitsPerLatUnit: number;
}

export interface ZoomEvent {
    latitudeDelta: number;
    longitudeDelta: number;
}

export interface PanEvent {
    latitudeDelta: number;
    longitudeDelta: number;
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
    @Output() public zoom = new EventEmitter<ZoomEvent>();
    @Output() public pan = new EventEmitter<PanEvent>();
    @ViewChild("mapCanvas") private _mapCanvasElement: ElementRef;
    private _mapCanvas: Canvas;
    private _mapCanvasCtx: CanvasRenderingContext2D;
    private _mapImages: MapImage[] = [];
    private _mapLabels: MapLabel[] = [];
    private _viewArea: MapArea = {longitude: {low: 0, high: 100}, latitude: {low: 0, high: 100}};
    private _onAspectRatioChanged = new Subject<CanvasAspectRatio>();

    private _isPanning: boolean;

    private WHEEL_ZOOM_SCALAR = 0.001;

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

    public set viewArea(viewArea: MapArea) {
        this._viewArea = viewArea;
        this.redraw();
    }

    public get aspectRatio(): CanvasAspectRatio {
        return {
            latUnitsPerLonUnit: this._mapCanvas.offsetHeight / this._mapCanvas.offsetWidth,
            lonUnitsPerLatUnit: this._mapCanvas.offsetWidth / this._mapCanvas.offsetHeight,
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

    public handleEvent(interaction: {
        wheel?: WheelEvent; mouseDown?: MouseEvent; mouseMove?: MouseEvent, mouseUp?: MouseEvent
    }): void {
        if (interaction.wheel) {
            const latitudeSize = this._viewArea.latitude.high - this._viewArea.latitude.low;
            const latitudeDelta = latitudeSize * interaction.wheel.deltaY * this.WHEEL_ZOOM_SCALAR;
            const longitudeDelta = latitudeDelta * this.aspectRatio.lonUnitsPerLatUnit;
            this.zoom.emit({latitudeDelta, longitudeDelta});
        } else if (!this._isPanning && interaction.mouseDown && interaction.mouseDown.button === 0) {
            this._isPanning = true;
        } else if (this._isPanning && interaction.mouseMove) {
            const latitudeSize = this._viewArea.latitude.high - this._viewArea.latitude.low;
            const longitudeSize = this._viewArea.longitude.high - this._viewArea.longitude.low;
            const panScalar = -0.001;
            const latitudeDelta = latitudeSize * interaction.mouseMove.movementY * panScalar;
            const longitudeDelta = longitudeSize * interaction.mouseMove.movementX * panScalar;
            this.pan.emit({latitudeDelta, longitudeDelta});
        } else if (this._isPanning && interaction.mouseUp && interaction.mouseUp.button === 0) {
            this._isPanning = false;
        }
    }

    private get canvasArea(): MapArea {
        return {
            longitude: {low: 0, high: this._mapCanvas.offsetWidth},
            latitude: {low: 0, high: this._mapCanvas.offsetHeight},
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
            const pixelXLow = convertToCanvasRange(this._viewArea.longitude, mapImage.longitude.low, this.canvasArea.longitude);
            const pixelXHigh = convertToCanvasRange(this._viewArea.longitude, mapImage.longitude.high, this.canvasArea.longitude);
            const pixelYLow = convertToCanvasRange(this._viewArea.latitude, mapImage.latitude.low, this.canvasArea.latitude);
            const pixelYHigh = convertToCanvasRange(this._viewArea.latitude, mapImage.latitude.high, this.canvasArea.latitude);
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
            const pixelX = convertToCanvasRange(this._viewArea.longitude, mapLabel.longitude, this.canvasArea.longitude);
            const pixelY = convertToCanvasRange(this._viewArea.latitude, mapLabel.latitude, this.canvasArea.latitude);
            this._mapCanvasCtx.fillText(mapLabel.text, pixelX, pixelY);
        }
        this._mapCanvasCtx.restore();
    }

    private drawLatLon(): void {
        this._mapCanvasCtx.save();
        this._mapCanvasCtx.font = `12px Arial`;
        this._mapCanvasCtx.fillStyle = "#FFF";
        this._mapCanvasCtx.textAlign = "center";

        const lonXPos = this.canvasArea.longitude.high / 2;
        this._mapCanvasCtx.fillText("-  longitude  +", lonXPos, this.canvasArea.latitude.high - 5);

        const latYPos = this.canvasArea.latitude.high / 2;
        this._mapCanvasCtx.rotate(-Math.PI / 2);
        this._mapCanvasCtx.fillText("-  latitude  +", -latYPos, this.canvasArea.longitude.high);

        this._mapCanvasCtx.restore();
    }
}
