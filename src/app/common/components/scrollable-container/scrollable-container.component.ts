import {Component, Input} from "@angular/core";
import {isNumeric} from "rxjs/internal-compatibility";


@Component({
    selector: "app-scrollable-container",
    templateUrl: "./scrollable-container.component.html",
    styleUrls: ["./scrollable-container.component.scss"]
})
export class ScrollableContainerComponent {
    @Input() private _leftFxFlex: number | string = "0%";
    @Input() private _rightFxFlex: number | string = "0%";
    @Input() private _topFxFlex: number | string = "0%";
    @Input() private _bottomFxFlex: number | string = "0%";

    public constructor() {
    }

    public get LeftFxFlex(): string {
        return convert(this._leftFxFlex);
    }

    public get RightFxFlex(): string {
        return convert(this._rightFxFlex);
    }

    public get TopFxFlex(): string {
        return convert(this._topFxFlex);
    }

    public get BottomFxFlex(): string {
        return convert(this._bottomFxFlex);
    }

}

function convert(fxFlexInstruction: number | string): string {
    let msg = `Converting '${fxFlexInstruction}'`;
    let fxFlexInstructionStr: string;
    if (typeof fxFlexInstruction === "string") {
        fxFlexInstructionStr = fxFlexInstruction;
    } else if (typeof fxFlexInstruction === "number") {
        fxFlexInstructionStr = fxFlexInstruction.toString();
        msg += `-> From number to '${fxFlexInstructionStr}'`;
    } else {
        throw new Error(`[${ScrollableContainerComponent}] Failed to convert flex instruction '${fxFlexInstruction}'`);
    }
    if (isNumeric(fxFlexInstructionStr)) {
        fxFlexInstructionStr = `${fxFlexInstructionStr}%`;
        msg += `-> From numeric string to '${fxFlexInstructionStr}'`;
    }
    console.log(msg);
    return fxFlexInstructionStr;
}
