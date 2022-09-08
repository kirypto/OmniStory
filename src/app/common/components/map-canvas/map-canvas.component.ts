import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from "@angular/core";
import {fromEvent, Observable, Subject} from "rxjs";
import {NumericRange, sizeOf} from "../../numeric-range";
import {SubscribingComponent} from "../SubscribingComponent";

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

interface CanvasArea {
    x: NumericRange;
    y: NumericRange;
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

export interface MapContextMenuEvent {
    x: number;
    y: number;
    latitude: number;
    longitude: number;
}

function convertPositionInRange(inputRange: NumericRange, input: number, outputRange: NumericRange): number {
    const inputPercent = (input - inputRange.low) / (inputRange.high - inputRange.low);
    return (outputRange.high - outputRange.low) * inputPercent + outputRange.low;
}

function convertDeltaOfRange(inputRange: NumericRange, inputDelta: number, outputRange: NumericRange): number {
    const inputRangeSize = sizeOf(inputRange);
    const inputRangePercent = Math.min(1, Math.max(-1, inputDelta / inputRangeSize));
    return inputRangePercent * sizeOf(outputRange);
}

@Component({
    selector: "app-map-canvas",
    templateUrl: "./map-canvas.component.html",
    styleUrls: ["./map-canvas.component.css"],
})
export class MapCanvasComponent extends SubscribingComponent implements AfterViewInit {
    @Output() public zoom = new EventEmitter<ZoomEvent>();
    @Output() public pan = new EventEmitter<PanEvent>();
    @Output() public mapContextMenu = new EventEmitter<MapContextMenuEvent>();
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
        super();
        this.newSubscription = fromEvent(window, "resize").subscribe(() => {
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

        // // Modify drawing context so origin (x=0;y=0) is at bottom left corner and so y increases upwards.
        // this._mapCanvasCtx.translate(0, this._mapCanvas.height);
        // this._mapCanvasCtx.scale(0, -1);

        setTimeout(() => this.updateCanvasSize(), 1); // update canvas size as soon as element size settles
    }

    public handleEvent(interaction: {
        wheel?: WheelEvent,
        mouseDown?: MouseEvent, mouseMove?: MouseEvent, mouseUp?: MouseEvent,
        click?: MouseEvent, contextMenu?: MouseEvent,
    }): void {
        if (interaction.wheel) {
            const latitudeSize = this._viewArea.latitude.high - this._viewArea.latitude.low;
            const latitudeZoomDelta = latitudeSize * interaction.wheel.deltaY * this.WHEEL_ZOOM_SCALAR;
            const longitudeZoomDelta = latitudeZoomDelta * this.aspectRatio.lonUnitsPerLatUnit;
            this.zoom.emit({latitudeDelta: latitudeZoomDelta, longitudeDelta: longitudeZoomDelta});

            const latitudePanRange: NumericRange = {low: latitudeZoomDelta / 2, high: -latitudeZoomDelta / 2};
            const longitudePanRange: NumericRange = {low: longitudeZoomDelta / 2, high: -longitudeZoomDelta / 2};
            const latitudePanDelta = convertPositionInRange(this.canvasArea.y, interaction.wheel.offsetY, latitudePanRange);
            const longitudePanDelta = convertPositionInRange(this.canvasArea.x, interaction.wheel.offsetX, longitudePanRange);
            this.pan.emit({latitudeDelta: latitudePanDelta, longitudeDelta: longitudePanDelta});
        } else if (!this._isPanning && interaction.mouseDown && interaction.mouseDown.button === 0) {
            this._isPanning = true;
        } else if (this._isPanning && interaction.mouseMove) {
            const latitudeDelta = convertDeltaOfRange(this.canvasArea.y, interaction.mouseMove.movementY * -1, this._viewArea.latitude);
            const longitudeDelta = convertDeltaOfRange(this.canvasArea.x, interaction.mouseMove.movementX * -1, this._viewArea.longitude);
            this.pan.emit({latitudeDelta, longitudeDelta});
        } else if (this._isPanning && interaction.mouseUp && interaction.mouseUp.button === 0) {
            this._isPanning = false;
        } else if (interaction.contextMenu) {
            const longitude = convertPositionInRange(this.canvasArea.x, interaction.contextMenu.offsetX, this._viewArea.longitude);
            const latitude = convertPositionInRange(this.canvasArea.y, interaction.contextMenu.offsetY, this._viewArea.latitude);
            interaction.contextMenu.preventDefault();
            this.mapContextMenu.emit({latitude, longitude, x: interaction.contextMenu.x, y: interaction.contextMenu.y});
        }
    }

    private get canvasArea(): CanvasArea {
        return {
            x: {low: 0, high: this._mapCanvas.offsetWidth},
            y: {low: this._mapCanvas.offsetHeight, high: 0},
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
            const pixelXLow = convertPositionInRange(this._viewArea.longitude, mapImage.longitude.low, this.canvasArea.x);
            const pixelXHigh = convertPositionInRange(this._viewArea.longitude, mapImage.longitude.high, this.canvasArea.x);
            const pixelYLow = convertPositionInRange(this._viewArea.latitude, mapImage.latitude.low, this.canvasArea.y);
            const pixelYHigh = convertPositionInRange(this._viewArea.latitude, mapImage.latitude.high, this.canvasArea.y);
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
            const pixelX = convertPositionInRange(this._viewArea.longitude, mapLabel.longitude, this.canvasArea.x);
            const pixelY = convertPositionInRange(this._viewArea.latitude, mapLabel.latitude, this.canvasArea.y);
            this._mapCanvasCtx.fillText(mapLabel.text, pixelX, pixelY);
        }
        this._mapCanvasCtx.restore();
    }

    private drawLatLon(): void {
        this._mapCanvasCtx.save();
        this._mapCanvasCtx.font = `14px Arial`;
        this._mapCanvasCtx.fillStyle = "#FFF";
        this._mapCanvasCtx.textAlign = "center";

        const lonXPos = this.canvasArea.x.high / 2;
        this._mapCanvasCtx.fillText("-  longitude  +", lonXPos, this.canvasArea.y.low - 7);

        const latYPos = this.canvasArea.y.low / 2;
        this._mapCanvasCtx.rotate(-Math.PI / 2);
        this._mapCanvasCtx.fillText("-  latitude  +", -latYPos, this.canvasArea.x.high - 5);

        this._mapCanvasCtx.restore();
    }
}
