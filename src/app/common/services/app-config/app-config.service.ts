import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {parse} from "yaml";
import {CalendarConfig, TtapiConfig} from "../../types/config-types";
import {CalendarType} from "../../types/calendar-type";


function initializeTtapiConfig(configContainer: object): TtapiConfig {
    return {
        baseUrl: extractConfig(configContainer, "baseUrl", "string"),
    };
}

function initializeCalendarConfig(configContainer: object): CalendarConfig {
    const calendarTypeRaw = extractConfig(configContainer, "system", "string");
    const calendarType: CalendarType = CalendarType[calendarTypeRaw as keyof typeof CalendarType];
    if (calendarType === undefined) {
        throw new Error(`Failed parse calendar configuration, unknown system '${calendarTypeRaw}'`);
    }
    return {
        system: calendarType,
    };
}

@Injectable({providedIn: "root"})
export class AppConfigService {
    private _initialized = false;
    private _version: string;
    private _ttapi: TtapiConfig;
    private _calendar: CalendarConfig;

    public constructor(
        private _httpClient: HttpClient
    ) {
    }

    public get version(): string {
        this.validateInitialized();
        return this._version;
    }

    public get ttapiConfig(): TtapiConfig {
        return this._ttapi;
    }

    public get calendarConfig(): CalendarConfig {
        return this._calendar;
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
        this._ttapi = initializeTtapiConfig(extractConfig(configContainer, "ttapiConfiguration", "object"));
        this._calendar = initializeCalendarConfig(extractConfig(configContainer, "calendarConfiguration", "object"));

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
