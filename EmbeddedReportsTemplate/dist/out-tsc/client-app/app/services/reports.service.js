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
var report_1 = require("../shared/report");
var corrispettivi_report_component_1 = require("../corrispettivi/corrispettivi-report/corrispettivi-report.component");
var corrispettivi_content_component_1 = require("../corrispettivi/corrispettivi-content/corrispettivi-content.component");
var corrispettivi_data_provider_1 = require("../corrispettivi/corrispettivi-data-provider");
var data_transformer_1 = require("../corrispettivi/data-transformer");
var reviso_reports_api_service_1 = require("./reviso-reports-api.service");
var reviso_vat_accounts_service_1 = require("./reviso-vat-accounts.service");
var reviso_number_series_service_1 = require("./reviso-number-series.service");
var agreement_service_1 = require("./agreement.service");
var ReportsService = /** @class */ (function () {
    function ReportsService(_agreementService, _reportApiService, _revisoNumberSeriesService, _revisoVatAccountsService) {
        this._agreementService = _agreementService;
        this._reportApiService = _reportApiService;
        this._revisoNumberSeriesService = _revisoNumberSeriesService;
        this._revisoVatAccountsService = _revisoVatAccountsService;
        this._reports = [
            new report_1.Report(corrispettivi_report_component_1.CorrispettiviReportComponent, corrispettivi_content_component_1.CorrispettiviContentComponent, new corrispettivi_data_provider_1.CorrispettiviDataProvider(this._agreementService, this._revisoNumberSeriesService, this._reportApiService, _revisoVatAccountsService), new data_transformer_1.DataTransformer(), { name: "corrispettivi", filter: {}, title: "Registro IVA corrispettivi" }),
        ];
    }
    ReportsService.prototype.getReports = function () {
        return this._reports;
    };
    ReportsService.prototype.getReportByName = function (reportName) {
        return this._reports.find(function (r) { return r.data.name === reportName; });
    };
    ReportsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [agreement_service_1.AgreementService,
            reviso_reports_api_service_1.RevisoReportsApiService,
            reviso_number_series_service_1.RevisoNumberSeriesService,
            reviso_vat_accounts_service_1.RevisoVatAccountsService])
    ], ReportsService);
    return ReportsService;
}());
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map