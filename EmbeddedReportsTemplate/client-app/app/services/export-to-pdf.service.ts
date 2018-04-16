import { GrantTokenService } from './grant-token.service';
import { handleHttpError } from '../handle-error';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { ResponseType } from '@angular/http';

@Injectable()
export class ExportToPdfService {

  constructor(
    private _httpClient: HttpClient,
    private _grantTokenService: GrantTokenService
  ) { }

  export(content: any): Observable<any> {
    return this._httpClient.post('/api/exportcorrispettivitopdf', content , {
      headers: {
        'x-embedded-reports-template-grant-token': this._grantTokenService.grantToken,
      },
      responseType: 'blob',
    }).pipe(
      tap(response => console.log(response)),
      catchError(handleHttpError(ExportToPdfService.name, 'export'))
    );
  }
}
