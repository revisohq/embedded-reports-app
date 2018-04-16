import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { handleHttpError } from '../handle-error';
import { IApplicationVersion } from '../shared/application-version';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ApplicationVersionService {

  constructor(private _httpClient: HttpClient) { }

  getApplicationVersion(): Observable<IApplicationVersion> {
    const hostName = window.location.host;
    if (hostName.indexOf('localhost') >= 0 || hostName.indexOf('test') >= 0) {
      return this._httpClient.get<IApplicationVersion>('/api/version')
        .pipe(
        tap(_ => console.log(`Fetched application version.`)),
        catchError(handleHttpError(ApplicationVersionService.name, 'getApplicationVersion'))
        );
    } else {
      return of({
        major: 0,
        minor: 0,
        patch: 0,
      });
    }
  }

}
