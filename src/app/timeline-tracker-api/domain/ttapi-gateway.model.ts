import {paths} from "@ttapi/domain/schema.model";
import {Observable} from "rxjs";

export abstract class TtapiGateway {
    public abstract fetch<
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
    ): Observable<TReturn>;
}

export type FetchPathParamsType<TPath extends keyof paths, TMethod extends keyof paths[TPath]> = paths[TPath][TMethod] extends {
        parameters: { path: infer TPathParams }
    }
    ? TPathParams
    : {};

export type FetchQueryParamsType<TPath extends keyof paths, TMethod extends keyof paths[TPath]> = paths[TPath][TMethod] extends {
        parameters: { query: infer TQueryParams }
    }
    ? TQueryParams
    : {};

export type FetchBodyType<TPath extends keyof paths, TMethod extends keyof paths[TPath]> = paths[TPath][TMethod] extends {
        requestBody: { content: { "application/json": infer TBody } }
    }
    ? TBody
    : void;

export type FetchResponseType<TPath extends keyof paths, TMethod extends keyof paths[TPath]> = paths[TPath][TMethod] extends {
        responses: infer TResponses
    }
    ? TResponses extends { 201: { content: { "application/json": infer TCreatedResponse } } }
        ? TCreatedResponse
        : TResponses extends { 200: { content: { "application/json": infer TOkResponse } } }
            ? TOkResponse
            : {}
    : never;
