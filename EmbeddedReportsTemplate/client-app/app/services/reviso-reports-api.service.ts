import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { HttpClient } from '@angular/common/http';

import { GrantTokenService } from './grant-token.service';
import { handleHttpError } from '../handle-error';
import { IRevisoEntryLine } from '../shared/reviso-entry-line';
import { IRevisoReportResponseMessage } from '../shared/reviso-response';

@Injectable()
export class RevisoReportsApiService {

    constructor(
        private _httpClient: HttpClient,
        private _grantTokenService: GrantTokenService) { }

    getEntryList(filter: string): Observable<IRevisoReportResponseMessage<IRevisoEntryLine>> {
        return this._httpClient.get(`/api/entrylist?${filter}`, {
            headers: {
                'x-embedded-reports-template-grant-token': this._grantTokenService.grantToken
            }
        }).pipe(
            tap(_ => console.log('Filtered entries fetched from Reviso.')),
            catchError(handleHttpError(RevisoReportsApiService.name, 'getEntryList'))
        );
    }

    getBookedEntryList(filter: string): Observable<IRevisoReportResponseMessage<IRevisoEntryLine>> {

        return this._httpClient.get(`/api/entrylist/booked?${filter}`, {
            headers: {
                'x-embedded-reports-template-grant-token': this._grantTokenService.grantToken
            }
        }).pipe(
            tap(_ => console.log('Filtered entries fetched from Reviso.')),
            catchError(handleHttpError(RevisoReportsApiService.name, 'getEntryList'))
        );
    }
}
