"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var forkJoin_1 = require("rxjs/observable/forkJoin");
var period_enum_1 = require("../shared/period-enum");
var operators_1 = require("rxjs/operators");
var CorrispettiviDataProvider = /** @class */ (function () {
    function CorrispettiviDataProvider(_agreementService, _revisoNumberSeriesService, _reportService, _revisoVatAccountsService) {
        this._agreementService = _agreementService;
        this._revisoNumberSeriesService = _revisoNumberSeriesService;
        this._reportService = _reportService;
        this._revisoVatAccountsService = _revisoVatAccountsService;
    }
    CorrispettiviDataProvider.prototype.getReportData = function (reportFilter) {
        var entryListFilter = this.getEndpointFilter(reportFilter);
        var agreement = this._agreementService.getRevisoAgreement();
        var numberSeries = this.pagedCall(this.getNumberSeriesService, null);
        var vatAccounts = this.pagedCall(this.getVatAccountsService, null);
        var reportResponse = reportFilter.includeDraftEntries
            ? this._reportService.getEntryList(entryListFilter)
            : this._reportService.getBookedEntryList(entryListFilter);
        var entries = reportResponse.pipe(operators_1.map(function (response) { return response.lines; }));
        return forkJoin_1.forkJoin([agreement, vatAccounts, entries, numberSeries]);
    };
    CorrispettiviDataProvider.prototype.pagedCall = function (service, filter) {
        var self = this;
        return Observable_1.Observable.create(function (subscriber) {
            var observer = {
                next: function (response) {
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
            };
            service.call(self, filter).subscribe(observer);
        });
    };
    CorrispettiviDataProvider.prototype.getVatAccountsService = function (filter) {
        return this._revisoVatAccountsService.getVatAccounts(filter);
    };
    CorrispettiviDataProvider.prototype.getNumberSeriesService = function (filter) {
        return this._revisoNumberSeriesService.getNumberSeries(filter);
    };
    CorrispettiviDataProvider.prototype.getEndpointFilter = function (filter) {
        var period = filter.period;
        var year = filter.year;
        var entryTypeFilter = "entryTypes=financeVoucher";
        var numberSeriesFilter = "numberSeriesPrefixes=" + filter.numberSeries.join(',');
        var periodFilter;
        switch (period) {
            case period_enum_1.PeriodEnum.January:
            case period_enum_1.PeriodEnum.March:
            case period_enum_1.PeriodEnum.May:
            case period_enum_1.PeriodEnum.July:
            case period_enum_1.PeriodEnum.August:
                periodFilter = "fromDate=" + year + "-0" + period + "-01&toDate=" + year + "-0" + period + "-31";
                break;
            case period_enum_1.PeriodEnum.October:
            case period_enum_1.PeriodEnum.December:
                periodFilter = "fromDate=" + year + "-" + period + "-01&toDate=" + year + "-" + period + "-31";
                break;
            case period_enum_1.PeriodEnum.February:
                var lastMonthDay = this.isLeapYear(year) ? 29 : 28;
                periodFilter = "fromDate=" + year + "-" + period + "-01&toDate=" + year + "-" + period + "-" + lastMonthDay;
                break;
            case period_enum_1.PeriodEnum.April:
            case period_enum_1.PeriodEnum.June:
            case period_enum_1.PeriodEnum.September:
                periodFilter = "fromDate=" + year + "-0" + period + "-01&toDate=" + year + "-0" + period + "-30";
                break;
            case period_enum_1.PeriodEnum.November:
                periodFilter = "fromDate=" + year + "-" + period + "-01&toDate=" + year + "-" + period + "-30";
                break;
            case period_enum_1.PeriodEnum.FirstQuarter:
                periodFilter = "fromDate=" + year + "-01-01&toDate=" + year + "-03-31";
                break;
            case period_enum_1.PeriodEnum.SecondQuarter:
                periodFilter = "fromDate=" + year + "-04-01&toDate=" + year + "-06-30";
                break;
            case period_enum_1.PeriodEnum.ThirdQuarter:
                periodFilter = "fromDate=" + year + "-07-01&toDate=" + year + "-09-30";
                break;
            case period_enum_1.PeriodEnum.FourthQuarter:
                periodFilter = "fromDate=" + year + "-10-01&toDate=" + year + "-12-31";
                break;
            case period_enum_1.PeriodEnum.Yearly:
                periodFilter = "fromDate=" + year + "-01-01&toDate=" + year + "-12-31";
                break;
            default:
                break;
        }
        return periodFilter + "&" + numberSeriesFilter + "&" + entryTypeFilter + "&pagesize=10000";
    };
    CorrispettiviDataProvider.prototype.isLeapYear = function (year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    };
    return CorrispettiviDataProvider;
}());
exports.CorrispettiviDataProvider = CorrispettiviDataProvider;
//# sourceMappingURL=corrispettivi-data-provider.js.map