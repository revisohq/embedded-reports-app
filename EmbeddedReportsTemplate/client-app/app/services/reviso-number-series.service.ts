import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GrantTokenService } from './grant-token.service';
import { handleHttpError } from '../handle-error';
import { IRevisoCollectionResponseMessage } from '../shared/reviso-response';
import { of } from 'rxjs/observable/of';
import { IRevisoNumberSeries } from '../shared/reviso-number-series';


@Injectable()
export class RevisoNumberSeriesService {

  private _numberSeries: IRevisoCollectionResponseMessage<IRevisoNumberSeries>;

  constructor(
    private _httpClient: HttpClient,
    private _grantTokenService: GrantTokenService) { }

  getNumberSeries(filter: string): Observable<IRevisoCollectionResponseMessage<IRevisoNumberSeries>> {
    if (this._numberSeries != null) {
      return of(this._numberSeries);
    } else {
      return this._httpClient.get('/api/numberseries', {
        headers: {
          'x-embedded-reports-template-grant-token': this._grantTokenService.grantToken
        }
      })
        .pipe(
          tap(_ => console.log('Number series fetched from Reviso.')),
          catchError(handleHttpError(RevisoNumberSeriesService.name, 'getNumberSeries'))
        );
    }
  }
}
