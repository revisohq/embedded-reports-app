"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var period_enum_1 = require("../../shared/period-enum");
var reviso_number_series_service_1 = require("../../services/reviso-number-series.service");
var CorrispettiviReportComponent = /** @class */ (function () {
    function CorrispettiviReportComponent(_revisoNumberSeriesService) {
        this._revisoNumberSeriesService = _revisoNumberSeriesService;
    }
    CorrispettiviReportComponent.prototype.ngOnInit = function () {
        this.setDefaultFilter();
        this.populateYears(2017, new Date().getFullYear());
        this.populatePeriods();
        this.numberSeries = [];
        this.loadNumberSeries();
    };
    CorrispettiviReportComponent.prototype.print = function () {
        window.print();
    };
    CorrispettiviReportComponent.prototype.shareCheckedList = function (items) {
        this.filter.numberSeries = items;
    };
    CorrispettiviReportComponent.prototype.shareIndividualCheckedList = function (item) {
        //console.log(item);
    };
    CorrispettiviReportComponent.prototype.clearFilter = function () {
        this.setDefaultFilter();
        this.numberSeries = this.numberSeries.slice(0);
        this.numberSeries.forEach(function (item) { return item.selected = false; });
        this.numberSeries[0].selected = true;
        this.filter.numberSeries = [this.numberSeries[0].value];
    };
    CorrispettiviReportComponent.prototype.setDefaultFilter = function () {
        var currentYear = (new Date()).getFullYear();
        var currentMonth = (new Date()).getMonth();
        this.filter = { year: currentYear, period: (currentMonth + 1) };
    };
    CorrispettiviReportComponent.prototype.populatePeriods = function () {
        this.periods = [
            { description: 'Gennaio', value: period_enum_1.PeriodEnum.January },
            { description: 'Febbraio', value: period_enum_1.PeriodEnum.February },
            { description: 'Marzo', value: period_enum_1.PeriodEnum.March },
            { description: 'Aprile', value: period_enum_1.PeriodEnum.April },
            { description: 'Maggio', value: period_enum_1.PeriodEnum.May },
            { description: 'Giugno', value: period_enum_1.PeriodEnum.June },
            { description: 'Luglio', value: period_enum_1.PeriodEnum.July },
            { description: 'Agosto', value: period_enum_1.PeriodEnum.August },
            { description: 'Settembre', value: period_enum_1.PeriodEnum.September },
            { description: 'Ottobre', value: period_enum_1.PeriodEnum.October },
            { description: 'Novembre', value: period_enum_1.PeriodEnum.November },
            { description: 'Dicembre', value: period_enum_1.PeriodEnum.December },
            { description: 'T1 - Primo trimestre', value: period_enum_1.PeriodEnum.FirstQuarter },
            { description: 'T2 - Secondo trimestre', value: period_enum_1.PeriodEnum.SecondQuarter },
            { description: 'T3 - Terzo trimestre', value: period_enum_1.PeriodEnum.ThirdQuarter },
            { description: 'T4 - Quarto trimestre', value: period_enum_1.PeriodEnum.FourthQuarter },
            { description: 'Annuale', value: period_enum_1.PeriodEnum.Yearly },
        ];
    };
    CorrispettiviReportComponent.prototype.populateYears = function (startYear, endYear) {
        this.years = new Array(endYear - startYear + 1);
        for (var i = 0; i < this.years.length; i++) {
            this.years[i] = startYear + i;
        }
    };
    CorrispettiviReportComponent.prototype.loadNumberSeries = function () {
        var _this = this;
        this.loadingNumberSeries = true;
        this._revisoNumberSeriesService.getNumberSeries(null)
            .map(function (response) {
            return response.collection;
        })
            .subscribe(function (items) {
            _this.numberSeries = items.map(function (item, index) {
                return {
                    selected: false,
                    name: item.prefix + " - " + item.name,
                    value: item.prefix,
                };
            })
                .sort(function (item1, item2) {
                return item1.name > item2.name ? 1 : item1.name < item2.name ? -1 : 0;
            });
            _this.numberSeries[0].selected = true;
            _this.filter.numberSeries = [_this.numberSeries[0].value];
            _this.loadingNumberSeries = false;
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CorrispettiviReportComponent.prototype, "name", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CorrispettiviReportComponent.prototype, "filter", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CorrispettiviReportComponent.prototype, "title", void 0);
    CorrispettiviReportComponent = __decorate([
        core_1.Component({
            selector: 'app-corrispettivi-report',
            templateUrl: './corrispettivi-report.component.html',
            styleUrls: ['./corrispettivi-report.component.css']
        }),
        __metadata("design:paramtypes", [reviso_number_series_service_1.RevisoNumberSeriesService])
    ], CorrispettiviReportComponent);
    return CorrispettiviReportComponent;
}());
exports.CorrispettiviReportComponent = CorrispettiviReportComponent;
//# sourceMappingURL=corrispettivi-report.component.js.map