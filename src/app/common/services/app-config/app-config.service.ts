import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: "root"})
export class AppConfigService {
    private _config: string;

    public constructor(private http: HttpClient) {
        this.fetchConfigYaml("app.config.yaml");
        console.log(`$CONFIG: ${this._config}`);
    }

    private fetchConfigYaml(filename: string): void {
        this.http.get(`/assets/config/${filename}`, {responseType: "text"}).subscribe(response => {
            this._config = response;
            console.log(`$CONFIG: ${this._config}`);
        });
    }
}
