import {Component, Injectable, OnInit} from "@angular/core";
import {DomSanitizer, Title} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material/icon";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
@Injectable({providedIn: "root"})
export class AppComponent implements OnInit {
    private _title = "Timeline Tracker UI";

    constructor(
        private _titleService: Title,
        private _matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
    ) {
        this._matIconRegistry.addSvgIcon("tag", domSanitizer.bypassSecurityTrustResourceUrl("assets/svg/tag.svg"));
    }

    get title(): string {
        return this._title;
    }

    ngOnInit(): void {
        this._titleService.setTitle(this._title);
    }
}
