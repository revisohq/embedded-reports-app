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
var router_1 = require("@angular/router");
var FileSaver = require("file-saver");
var report_content_host_directive_1 = require("../directives/report-content-host.directive");
var report_host_directive_1 = require("../directives/report-host.directive");
var reports_service_1 = require("../services/reports.service");
var ReportsHomeComponent = /** @class */ (function () {
    function ReportsHomeComponent(_componentFactoryResolver, _reportsService, _route) {
        this._componentFactoryResolver = _componentFactoryResolver;
        this._reportsService = _reportsService;
        this._route = _route;
        this.isCollapsed = false;
        this.dataAvailable = false;
        this.loading = false;
    }
    ReportsHomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._route.data.subscribe(function (value) { return _this._reportName = value.reportName; });
    };
    ReportsHomeComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this._reportName) {
            setTimeout(function () {
                _this.loadReport(_this._reportName);
            }, 0);
        }
    };
    ReportsHomeComponent.prototype.loadReport = function (reportName) {
        this.currentReport = this._reportsService.getReportByName(reportName);
        var reportComponentFactory = this._componentFactoryResolver.resolveComponentFactory(this.currentReport.component);
        var reportContentComponentFactory = this._componentFactoryResolver.resolveComponentFactory(this.currentReport.contentComponent);
        var reportViewContainerRef = this.reportHost.viewContainerRef;
        var reportContentViewContainerRef = this.reportContentHost.viewContainerRef;
        reportViewContainerRef.clear();
        reportContentViewContainerRef.clear();
        this._reportComponentRef = reportViewContainerRef.createComponent(reportComponentFactory);
        this._reportComponentRef.instance.filter = this.currentReport.data.filter;
        this._reportComponentRef.instance.name = this.currentReport.data.name;
        this._reportComponentRef.instance.title = this.currentReport.data.title;
        this.currentReportTitle = this.currentReport.data.title;
        this._reportContentComponentRef = reportContentViewContainerRef.createComponent(reportContentComponentFactory);
    };
    ReportsHomeComponent.prototype.clearFilter = function () {
        this._reportComponentRef.instance.clearFilter();
    };
    ReportsHomeComponent.prototype.getReportData = function () {
        var _this = this;
        this.loading = true;
        this.isCollapsed = true;
        this.currentReport.dataProvider.getReportData(this._reportComponentRef.instance.filter)
            .subscribe(function (data) {
            _this.dataAvailable = _this.dataCorrectlyLoaded(data);
            _this.loading = false;
            _this._reportContentComponentRef.instance.data = _this.transformReportData(data);
        }, function (error) { return _this.handleError(error); });
    };
    ReportsHomeComponent.prototype.printReport = function () {
        this._reportComponentRef.instance.print();
    };
    ReportsHomeComponent.prototype.exportToExcel = function () {
        var _this = this;
        this.loading = true;
        this.isCollapsed = true;
        var fileName = this._reportContentComponentRef.instance.getFileName();
        this._reportContentComponentRef.instance.exportToExcel().subscribe(function (response) {
            if (response != null) {
                FileSaver.saveAs(response, fileName + ".xlsx");
            }
            _this.loading = false;
        }, function (error) { return _this.handleError(error); });
    };
    ReportsHomeComponent.prototype.exportToPdf = function () {
        var _this = this;
        this.loading = true;
        this.isCollapsed = true;
        var fileName = this._reportContentComponentRef.instance.getFileName();
        this._reportContentComponentRef.instance.exportToPdf().subscribe(function (response) {
            if (response != null) {
                FileSaver.saveAs(response, fileName + ".pdf");
            }
            _this.loading = false;
        }, function (error) { return _this.handleError(error); });
    };
    ReportsHomeComponent.prototype.dataCorrectlyLoaded = function (data) {
        if (data instanceof Array) {
            return data.length != 0;
        }
        else {
            return data != null;
        }
    };
    ReportsHomeComponent.prototype.transformReportData = function (data) {
        var transformedData = null;
        try {
            transformedData = this.currentReport.dataTransformer.transform(data, this._reportComponentRef.instance.filter);
        }
        catch (error) {
            console.error(error);
        }
        return transformedData;
    };
    ReportsHomeComponent.prototype.handleError = function (error) {
        console.error(error);
    };
    __decorate([
        core_1.ViewChild(report_host_directive_1.ReportHostDirective),
        __metadata("design:type", report_host_directive_1.ReportHostDirective)
    ], ReportsHomeComponent.prototype, "reportHost", void 0);
    __decorate([
        core_1.ViewChild(report_content_host_directive_1.ReportContentHostDirective),
        __metadata("design:type", report_content_host_directive_1.ReportContentHostDirective)
    ], ReportsHomeComponent.prototype, "reportContentHost", void 0);
    ReportsHomeComponent = __decorate([
        core_1.Component({
            selector: 'app-reports-home',
            templateUrl: './reports-home.component.html',
            styleUrls: ['./reports-home.component.css']
        }),
        __metadata("design:paramtypes", [core_1.ComponentFactoryResolver,
            reports_service_1.ReportsService,
            router_1.ActivatedRoute])
    ], ReportsHomeComponent);
    return ReportsHomeComponent;
}());
exports.ReportsHomeComponent = ReportsHomeComponent;
//# sourceMappingURL=reports-home.component.js.map