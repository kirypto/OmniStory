import {AuthService} from "@auth0/auth0-angular";
import {Router} from "@angular/router";
import {arrayRequestBody, Fetcher, Middleware, OpArgType, OpReturnType} from "openapi-typescript-fetch";
import {CustomRequestInit, Fetch} from "openapi-typescript-fetch/dist/cjs/types";
import {catchError, EMPTY, firstValueFrom, from, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {paths} from "@ttapi/ttapi-schema";
import {WorldIds} from "@ttapi/ttapi-types";
import {ttapiConfig} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {TimelineTrackerApiModule} from "@ttapi/timeline-tracker-api.module";

class NotLoggedInError extends Error {
}

@Injectable({
    providedIn: TimelineTrackerApiModule,
})
export class TtapiGatewayService {
    private _fetcher;

    private readonly _getWorlds: () => Promise<{ status: number; data: WorldIds }>;

    constructor(
        private _authService: AuthService,
        private _router: Router,
    ) {
        const addAuthenticationTokenMiddleware: Middleware = async (url: string, init: CustomRequestInit, next: Fetch) => {
            init.headers.set("Authorization", `Bearer ${await firstValueFrom(this.getAuthToken())}`);
            return await next(url, init);
        };
        this._fetcher = Fetcher.for<paths>();
        this._fetcher.configure({
            baseUrl: ttapiConfig.baseUrl,
            init: {
                headers: {},
            },
            use: [
                addAuthenticationTokenMiddleware,
            ],
        });

        this._getWorlds = this._fetcher.path("/api/worlds").method("get").create();
    }

    public fetch<TPath extends keyof paths,
        TMethod extends keyof paths[TPath],
        TArgs extends OpArgType<paths[TPath][TMethod]>,
        TReturn extends OpReturnType<paths[TPath][TMethod]>>(
        path: TPath,
        method: TMethod,
        args: TArgs,
        redirectToAuth: boolean = true,
    ): Observable<TReturn> {
        return from((async () => {
            const fetcher = this._fetcher.path(path).method(method).create();
            const {data} = await fetcher(args);
            return data as TReturn;
        })()).pipe(
            catchError((err) => {
                if (err instanceof NotLoggedInError && redirectToAuth) {
                    console.log("Not logged in, redirecting to auth");
                    this._authService.loginWithRedirect({
                        appState: {target: this._router.url},
                    });
                    return EMPTY;
                }
                throw err;
            }),
        );
    }

    public fetch2<
        TPath extends keyof paths,
        TMethod extends keyof paths[TPath],
        TPathParams extends FetchPathParamsType<TPath, TMethod>,
        TQueryParams extends FetchQueryParamsType<TPath, TMethod>,
        TBody extends FetchBodyType<TPath, TMethod>,
        TReturn extends FetchResponseType<TPath, TMethod>,
    >(
        path: TPath,
        method: TMethod,
        pathParams: TPathParams,
        queryParams: TQueryParams,
        body: TBody,
        redirectToAuth: boolean = true,
    ): Observable<TReturn> {
        return from((async () => {
            const mergedParams = {...(pathParams as object), ...(queryParams as object)};
            const fetcher = this._fetcher.path(path).method(method).create();
            let response;
            if (Array.isArray(body)) {
                response = await fetcher(arrayRequestBody(body, mergedParams));
            } else {
                response = await fetcher({...mergedParams, ...(body as object)});
            }
            const {data} = response;
            return data as TReturn;
        })()).pipe(
            catchError((err) => {
                if (err instanceof NotLoggedInError && redirectToAuth) {
                    console.log("Not logged in, redirecting to auth");
                    this._authService.loginWithRedirect({
                        appState: {target: this._router.url},
                    });
                    return EMPTY;
                }
                throw err;
            }),
        );
    }

    private getAuthToken(): Observable<string> {
        return this._authService.getIdTokenClaims().pipe(
            map(value => {
                if (value === null || value === undefined) {
                    throw new NotLoggedInError("Not logged in!");
                }
                return value.__raw;
            }),
        );
    }
}

type FetchPathParamsType<TPath extends keyof paths, TMethod extends keyof paths[TPath]> = paths[TPath][TMethod] extends {
        parameters: { path: infer TPathParams }
    }
    ? TPathParams
    : {};

type FetchQueryParamsType<TPath extends keyof paths, TMethod extends keyof paths[TPath]> = paths[TPath][TMethod] extends {
        parameters: { query: infer TQueryParams }
    }
    ? TQueryParams
    : {};

type FetchBodyType<TPath extends keyof paths, TMethod extends keyof paths[TPath]> = paths[TPath][TMethod] extends {
        requestBody: { content: { "application/json": infer TBody } }
    }
    ? TBody
    : void;

type FetchResponseType<TPath extends keyof paths, TMethod extends keyof paths[TPath]> = paths[TPath][TMethod] extends {
        responses: infer TResponses
    }
    ? TResponses extends { 201: { content: { "application/json": infer TCreatedResponse } } }
        ? TCreatedResponse
        : TResponses extends { 200: { content: { "application/json": infer TOkResponse } } }
            ? TOkResponse
            : {}
    : never;
