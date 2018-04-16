import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GrantTokenService } from './grant-token.service';
import { handleHttpError } from '../handle-error';
import { IAgreement } from '../shared/agreement';

@Injectable()
export class AgreementService {

  constructor(
    private _httpClient: HttpClient,
    private _grantTokenService: GrantTokenService) { }

  getRevisoAgreement(): Observable<IAgreement> {
    return this._httpClient.get<IAgreement>('/api/revisoagreement', {
      headers: {
        'x-embedded-reports-template-grant-token': this._grantTokenService.grantToken
      }
    }).pipe(
      tap(_ => console.log('Fetched reviso agreement.')),
      catchError(handleHttpError(AgreementService.name, 'getRevisoAgreement'))
      );
  }

}
