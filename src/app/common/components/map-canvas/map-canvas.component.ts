import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";

@Component({
    selector: "app-map-canvas",
    templateUrl: "./map-canvas.component.html",
    styleUrls: ["./map-canvas.component.css"],
})
export class MapCanvasComponent implements OnInit {
    @ViewChild("mapCanvas") private _mapCanvasElement: ElementRef;

    constructor() {
    }

    ngOnInit(): void {
    }

}
