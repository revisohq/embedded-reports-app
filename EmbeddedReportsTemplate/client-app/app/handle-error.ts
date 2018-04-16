import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

export const handleHttpError = (context: string, operation: string): (error: HttpErrorResponse) => ErrorObservable => {
    return (error: HttpErrorResponse): ErrorObservable => {
        console.error(`${context}.${operation}:${error.message}`);
        return Observable.throw(new Error(error.message));
    };
};

