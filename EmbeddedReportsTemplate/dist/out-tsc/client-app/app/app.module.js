"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var datepicker_1 = require("ngx-bootstrap/datepicker");
var datepicker_2 = require("ngx-bootstrap/datepicker");
var buttons_1 = require("ngx-bootstrap/buttons");
var chronos_1 = require("ngx-bootstrap/chronos");
var collapse_1 = require("ngx-bootstrap/collapse");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var locale_1 = require("ngx-bootstrap/locale");
var modal_1 = require("ngx-bootstrap/modal");
var core_1 = require("@angular/core");
var pagination_1 = require("ngx-bootstrap/pagination");
var ngx_bootstrap_2 = require("ngx-bootstrap");
var tooltip_1 = require("ngx-bootstrap/tooltip");
var app_routing_module_1 = require("./app-routing.module");
var agreement_service_1 = require("./services/agreement.service");
var application_version_service_1 = require("./services/application-version.service");
var dialog_ok_cancel_service_1 = require("./services/dialog-ok-cancel.service");
var export_to_excel_service_1 = require("./services/export-to-excel.service");
var export_to_pdf_service_1 = require("./services/export-to-pdf.service");
var grant_token_service_1 = require("./services/grant-token.service");
var query_parameters_service_1 = require("./services/query-parameters.service");
var reports_service_1 = require("./services/reports.service");
var reviso_number_series_service_1 = require("./services/reviso-number-series.service");
var reviso_reports_api_service_1 = require("./services/reviso-reports-api.service");
var reviso_vat_accounts_service_1 = require("./services/reviso-vat-accounts.service");
var app_component_1 = require("./app.component");
var corrispettivi_report_component_1 = require("./corrispettivi/corrispettivi-report/corrispettivi-report.component");
var multi_select_dropdown_component_1 = require("./multi-select-dropdown/multi-select-dropdown.component");
var unexpected_error_component_1 = require("./unexpected-error/unexpected-error.component");
var reports_home_component_1 = require("./reports-home/reports-home.component");
var report_host_directive_1 = require("./directives/report-host.directive");
var report_content_host_directive_1 = require("./directives/report-content-host.directive");
var corrispettivi_content_component_1 = require("./corrispettivi/corrispettivi-content/corrispettivi-content.component");
var loading_component_1 = require("./loading/loading.component");
var common_1 = require("@angular/common");
var it_1 = require("@angular/common/locales/it");
common_1.registerLocaleData(it_1.default, 'it-IT');
chronos_1.defineLocale('it', locale_1.itLocale);
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                corrispettivi_content_component_1.CorrispettiviContentComponent,
                corrispettivi_report_component_1.CorrispettiviReportComponent,
                multi_select_dropdown_component_1.MultiSelectDropdownComponent,
                report_content_host_directive_1.ReportContentHostDirective,
                report_host_directive_1.ReportHostDirective,
                reports_home_component_1.ReportsHomeComponent,
                unexpected_error_component_1.UnexpectedErrorComponent,
                loading_component_1.LoadingComponent,
            ],
            imports: [
                app_routing_module_1.AppRoutingModule,
                platform_browser_1.BrowserModule,
                datepicker_1.BsDatepickerModule.forRoot(),
                ngx_bootstrap_1.BsDropdownModule.forRoot(),
                buttons_1.ButtonsModule.forRoot(),
                collapse_1.CollapseModule.forRoot(),
                forms_1.FormsModule,
                http_1.HttpClientModule,
                modal_1.ModalModule.forRoot(),
                pagination_1.PaginationModule.forRoot(),
                ngx_bootstrap_2.ProgressbarModule.forRoot(),
                forms_1.ReactiveFormsModule,
                tooltip_1.TooltipModule.forRoot()
            ],
            providers: [
                agreement_service_1.AgreementService,
                application_version_service_1.ApplicationVersionService,
                datepicker_2.BsLocaleService,
                modal_1.BsModalRef,
                modal_1.BsModalService,
                dialog_ok_cancel_service_1.DialogOkCancelService,
                export_to_excel_service_1.ExportToExcelService,
                export_to_pdf_service_1.ExportToPdfService,
                grant_token_service_1.GrantTokenService,
                query_parameters_service_1.QueryParametersService,
                reports_service_1.ReportsService,
                reviso_number_series_service_1.RevisoNumberSeriesService,
                reviso_reports_api_service_1.RevisoReportsApiService,
                reviso_vat_accounts_service_1.RevisoVatAccountsService,
            ],
            entryComponents: [
                corrispettivi_content_component_1.CorrispettiviContentComponent,
                corrispettivi_report_component_1.CorrispettiviReportComponent,
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map