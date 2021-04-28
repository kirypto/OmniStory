import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {parse} from "yaml";

@Injectable({providedIn: "root"})
export class AppConfigService {
    private _initialized = false;
    private _version: string;
    private _ttapiBaseUrl: string;

    public constructor(
        private _httpClient: HttpClient
    ) {
    }

    public get version(): string {
        this.validateInitialized();
        return this._version;
    }

    public get ttapiBaseUrl(): string {
        this.validateInitialized();
        return this._ttapiBaseUrl;
    }

    public loadApplicationConfig(): Promise<void> {
        if (this._initialized) {
            throw new Error("AppConfigService was already initialized.");
        }
        return this._httpClient.get(`/assets/app-config.yaml`, {responseType: "text"})
            .toPromise()
            .then((configText: string) => {
                const configContainer = parse(configText);
                this.initialize(configContainer);
            });
    }

    private initialize(configContainer: object): void {
        this._version = extractConfig(configContainer, "version", "string");
        this._ttapiBaseUrl = extractConfig(configContainer, "ttapiBaseUrl", "string");

        this._initialized = true;
    }

    private validateInitialized(): void {
        if (!this._initialized) {
            throw new Error("AppConfigService has not been initialized yet.");
        }
    }
}


function extractConfig(container: object, name: string, requiredType: string): any {
    if (!(name in container)) {
        throw new Error(`No config was provided for '${name}'`);
    }
    const configValue = container[name];
    if (typeof configValue !== requiredType) {
        throw new Error(`Failed to extract config '${name}', needed entry of type ${requiredType}, got '${configValue}'.`);
    }
    return configValue;
}
