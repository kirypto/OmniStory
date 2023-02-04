import {Component, Input} from "@angular/core";


@Component({
    selector: "app-scrollable-container",
    templateUrl: "./scrollable-container.component.html",
    styleUrls: ["./scrollable-container.component.scss"]
})
export class ScrollableContainerComponent {
    @Input() private flexPadAll: string = undefined;
    @Input() private flexPadTB: string = undefined;
    @Input() private flexPadLR: string = undefined;
    @Input() private flexPadTop: string = undefined;
    @Input() private flexPadBottom: string = undefined;
    @Input() private flexPadLeft: string = undefined;
    @Input() private flexPadRight: string = undefined;
    public constructor() {
    }

    public get containerStyle(): string {
        const flexPadTop = this.flexPadTop || this.flexPadTB || this.flexPadAll || "0%";
        const flexPadBottom = this.flexPadBottom || this.flexPadTB || this.flexPadAll || "0%";
        const flexPadLeft = this.flexPadLeft || this.flexPadLR || this.flexPadAll || "0%";
        const flexPadRight = this.flexPadRight || this.flexPadLR || this.flexPadAll || "0%";

        return `
            display: grid;
            height: 100%;
            grid-template-rows: ${flexPadTop} [content-row-start] auto [content-row-end] ${flexPadBottom};
            grid-template-columns: ${flexPadLeft} [content-column-start] auto [content-column-end] ${flexPadRight};
        `;
    }
}
