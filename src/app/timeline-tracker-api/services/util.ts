import {Observable, of} from "rxjs";

import {LocationFilters} from "./filters";


/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
export function handleError<T>(operation = "operation", result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
        console.error({
            text: `${operation} failed: ${error.message}. See error below for detail;`,
            cause: error,
        });

        // Let the app keep running by returning an empty result.
        return of(result as T);
    };
}

export function constructEncodedQueryParams(filters?: LocationFilters): string {
    if (filters === undefined) {
        return "";
    }

    const encodedFilters = new Map<string, string>();
    for (const filterName of [
        "nameIs", "nameHas",
        "taggedAll", "taggedAny", "taggedOnly", "taggedNone",
        "spanIncludes", "spanIntersects"
    ]) {
        if (filters[filterName] !== undefined) {
            encodedFilters.set(filterName, encodeURI(filters[filterName]));
        }
    }

    let encodedParamString = encodedFilters.size === 0 ? "" : "?";
    for (const [filterName, filterValue] of encodedFilters.entries()) {
        if (!encodedParamString.endsWith("?")) {
            encodedParamString += "&";
        }
        encodedParamString += `${filterName}=${filterValue}`;
    }
    return encodedParamString;
}

