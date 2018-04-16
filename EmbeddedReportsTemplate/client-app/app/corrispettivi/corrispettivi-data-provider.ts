import { Observable } from "rxjs/Observable";
import { forkJoin } from "rxjs/observable/forkJoin";
import { of } from 'rxjs/observable/of';

import { IDataProvider } from "../shared/data-provider";
import { IRevisoEntryLine } from "../shared/reviso-entry-line";
import { PeriodEnum } from "../shared/period-enum";

import { RevisoReportsApiService } from "../services/reviso-reports-api.service";
import { RevisoVatAccountsService } from "../services/reviso-vat-accounts.service";
import { RevisoNumberSeriesService } from "../services/reviso-number-series.service";
import { AgreementService } from "../services/agreement.service";
import { IRevisoCollectionResponseMessage } from "../shared/reviso-response";
import { filter, map } from "rxjs/operators";
import { IRevisoVatAccount } from "../shared/reviso-vat-account";
import { IRevisoNumberSeries } from "../shared/reviso-number-series";


export class CorrispettiviDataProvider implements IDataProvider {

    constructor(
        private _agreementService: AgreementService,
        private _revisoNumberSeriesService: RevisoNumberSeriesService,
        private _reportService: RevisoReportsApiService,
        private _revisoVatAccountsService: RevisoVatAccountsService
    ) { }

    getReportData(reportFilter: any): Observable<any> {
        let entryListFilter = this.getEndpointFilter(reportFilter);
        let agreement = this._agreementService.getRevisoAgreement();
        let numberSeries = this.pagedCall<IRevisoNumberSeries>(this.getNumberSeriesService ,null);
        let vatAccounts = this.pagedCall<IRevisoVatAccount>(this.getVatAccountsService, null);
        let reportResponse = reportFilter.includeDraftEntries
            ? this._reportService.getEntryList(entryListFilter)
            : this._reportService.getBookedEntryList(entryListFilter);

        let entries = reportResponse.pipe(
            map(response => response.lines)
        );
        

        return forkJoin([agreement, vatAccounts, entries, numberSeries])
    }

    private pagedCall<T>(service: (filter: string) => Observable<IRevisoCollectionResponseMessage<T>>, filter: string): Observable<Array<T>> {
        let self = this;
        return Observable.create((subscriber) => {
            const observer = {
                next: (response: IRevisoCollectionResponseMessage<T>) => {
                    if (response.collection && response.collection.length) {
                        subscriber.next(response.collection);
                    }
                    else {
                        subscriber.complete();
                    }

                    if (response.pagination && response.pagination.nextPage) {
                        service.call(self, response.pagination.nextPage).subscribe(observer);
                    }
                    else {
                        subscriber.complete();
                    }
                }
            }

            service.call(self, filter).subscribe(observer);
        })
    }

    private getVatAccountsService(filter: string): Observable<IRevisoCollectionResponseMessage<IRevisoVatAccount>> {
        return this._revisoVatAccountsService.getVatAccounts(filter);
    }

    private getNumberSeriesService(filter: string): Observable<IRevisoCollectionResponseMessage<IRevisoNumberSeries>> {
        return this._revisoNumberSeriesService.getNumberSeries(filter);
    }

    private getEndpointFilter(filter): string {
        const period: PeriodEnum = filter.period;
        const year: number = filter.year;

        let entryTypeFilter = "entryTypes=financeVoucher";
        let numberSeriesFilter = `numberSeriesPrefixes=${filter.numberSeries.join(',')}`;
        let periodFilter: string;
        switch (period) {
            case PeriodEnum.January:
            case PeriodEnum.March:
            case PeriodEnum.May:
            case PeriodEnum.July:
            case PeriodEnum.August:
                periodFilter = `fromDate=${year}-0${period}-01&toDate=${year}-0${period}-31`;
                break;
            case PeriodEnum.October:
            case PeriodEnum.December:
                periodFilter = `fromDate=${year}-${period}-01&toDate=${year}-${period}-31`;
                break;
            case PeriodEnum.February:
                const lastMonthDay = this.isLeapYear(year) ? 29 : 28;
                periodFilter = `fromDate=${year}-${period}-01&toDate=${year}-${period}-${lastMonthDay}`;
                break;
            case PeriodEnum.April:
            case PeriodEnum.June:
            case PeriodEnum.September:
                periodFilter = `fromDate=${year}-0${period}-01&toDate=${year}-0${period}-30`;
                break;
            case PeriodEnum.November:
                periodFilter = `fromDate=${year}-${period}-01&toDate=${year}-${period}-30`;
                break;
            case PeriodEnum.FirstQuarter:
                periodFilter = `fromDate=${year}-01-01&toDate=${year}-03-31`;
                break;
            case PeriodEnum.SecondQuarter:
                periodFilter = `fromDate=${year}-04-01&toDate=${year}-06-30`;
                break;
            case PeriodEnum.ThirdQuarter:
                periodFilter = `fromDate=${year}-07-01&toDate=${year}-09-30`;
                break;
            case PeriodEnum.FourthQuarter:
                periodFilter = `fromDate=${year}-10-01&toDate=${year}-12-31`;
                break;
            case PeriodEnum.Yearly:
                periodFilter = `fromDate=${year}-01-01&toDate=${year}-12-31`;
                break;
            default:
                break;
        }

        return `${periodFilter}&${numberSeriesFilter}&${entryTypeFilter}&pagesize=10000`;
    }

    private isLeapYear(year): boolean {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }
}