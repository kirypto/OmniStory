import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private _title = "Timeline Tracker UI";

  get title(): string {
    return this._title;
  }
}
