import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: "root"})
export class AppConfigService {
    private _config: string = undefined;

    public constructor(
        private _httpClient: HttpClient
    ) {
    }

    public get config(): string | undefined {
        return this._config;
    }

    public initializeConfig(): Promise<void> {
        return this._httpClient.get(`/assets/config/app.config.yaml`, {responseType: "text"})
            .toPromise()
            .then((configText: string) => {
                this._config = configText;
            });
    }
}
