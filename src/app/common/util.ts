import {Observable, of} from "rxjs";


export function Required<T>(target: T, propertyKey: string): void {
    Object.defineProperty(target, propertyKey, {
        get(): T {
            throw new Error(`Attribute ${propertyKey} is required`);
        },
        set(value: T): void {
            Object.defineProperty(target, propertyKey, {
                value,
                writable: true,
                configurable: true,
            });
        },
        configurable: true
    });
}

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

