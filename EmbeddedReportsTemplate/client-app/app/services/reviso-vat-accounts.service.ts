import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { handleHttpError } from '../handle-error';
import { IRevisoCollectionResponseMessage } from '../shared/reviso-response';
import { IRevisoVatAccount } from '../shared/reviso-vat-account';

import { GrantTokenService } from './grant-token.service';

@Injectable()
export class RevisoVatAccountsService {

  constructor(
    private _httpClient: HttpClient,
    private _grantTokenService: GrantTokenService) { }

    getVatAccounts(filter: string): Observable<IRevisoCollectionResponseMessage<IRevisoVatAccount>> {
      return this._httpClient.get('/api/vataccounts', {
        headers: {
          'x-embedded-reports-template-grant-token': this._grantTokenService.grantToken
        }
      }).pipe(
        tap(_ => console.log('Vat accounts fetched from Reviso.')),
        catchError(handleHttpError(RevisoVatAccountsService.name, 'getVatAccounts'))
        );
    }

}
