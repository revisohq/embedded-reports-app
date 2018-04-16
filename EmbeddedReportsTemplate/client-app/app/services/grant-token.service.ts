import { catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { handleHttpError } from '../handle-error';

@Injectable()
export class GrantTokenService {

  private _grantToken: string;

  constructor(private _http: HttpClient) { }

  get grantToken() {
    return this._grantToken;
  }

  getGrantToken(embeddedAppToken: string): Observable<string> {
    return this._http.get<string>(`/api/grant/${embeddedAppToken}`).pipe(
      tap(token => this._grantToken = token),
      catchError(handleHttpError(GrantTokenService.name, 'getGrantToken'))
    );
  }

}
