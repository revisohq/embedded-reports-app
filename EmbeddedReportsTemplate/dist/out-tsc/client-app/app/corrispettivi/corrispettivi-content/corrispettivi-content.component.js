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
var of_1 = require("rxjs/observable/of");
var export_to_excel_service_1 = require("../../services/export-to-excel.service");
var export_to_pdf_service_1 = require("../../services/export-to-pdf.service");
var CorrispettiviContentComponent = /** @class */ (function () {
    function CorrispettiviContentComponent(_exportToExcelService, _exportToPdfService) {
        this._exportToExcelService = _exportToExcelService;
        this._exportToPdfService = _exportToPdfService;
    }
    CorrispettiviContentComponent.prototype.ngOnInit = function () {
        this.data = {
            pages: []
        };
    };
    CorrispettiviContentComponent.prototype.getPageNumberSeriesName = function (page) {
        return page.numberSeriesName ? page.numberSeriesName : page.numberSeriesPrefix;
    };
    CorrispettiviContentComponent.prototype.getFinalSummaryPageNumber = function () {
        return this.data ? this.data.pages.length + 1 : 0;
    };
    CorrispettiviContentComponent.prototype.exportToExcel = function () {
        if (this.data) {
            return this._exportToExcelService.export(this.data);
        }
        else {
            return of_1.of(null);
        }
    };
    CorrispettiviContentComponent.prototype.exportToPdf = function () {
        if (this.data) {
            var content = this.getContentForPdf();
            return this._exportToPdfService.export(content);
        }
        else {
            return of_1.of(null);
        }
    };
    CorrispettiviContentComponent.prototype.getFileName = function () {
        return this.data != null ? "RegistroIvaCorrispettivi_" + this.data.period : 'export';
    };
    CorrispettiviContentComponent.prototype.getContentForPdf = function () {
        var docType = document.implementation.createDocumentType('html', '', '');
        var domDocument = document.implementation.createDocument('', 'html', docType);
        var head = domDocument.createElement('head');
        var body = domDocument.createElement('body');
        var style = domDocument.createElement('style');
        var headBreakRule = "\n      .page-break__header {\n        page-break-before: always;\n      }";
        var bodyRule = "\n    body {\n      font-size:12px;\n    }";
        var reportHeaderRule = "\n    .table-header {\n      font-family: helvetica, arial, sans-serif;\n      width: 100%;\n    }\n    \n    .header__right {\n      text-align: right;\n      line-height: 1.4;\n    }\n\n    .period-container {\n      margin-top: 20px;\n      color: #757575;\n    }\n  \n    h4 {\n        margin-top: 10px;\n        margin-bottom: 10px;\n        font-size: 18px;\n        font-weight: 500;\n    }";
        var tableRules = "\n      table {  \n        border-spacing: 0px;\n        margin-top: 20px;  \n        font-family: arial, helvetica, sans-serif;\n        width: 100%;\n        max-width: 100%;\n        margin-bottom: 20px;    \n        font-size: 12px;\n      }\n    \n    table caption {\n      font-weight: bold;\n      color: black;\n      background-color: #F3F3F3;\n      padding-left: 15px;\n      text-align: left;\n      padding-top: 10px;\n      padding-bottom: 10px;\n    }\n    \n    thead {\n        background-color: #F3F3F3; \n        text-align: left;\n    }\n    \n    .table__header-cell{\n        border-bottom: none;\n        height: 32px;\n        vertical-align: top;\n    }\n\n    .table__body-cell {\n      border-bottom-style: solid;\n      border-bottom-width: 1px;\n      border-bottom-color: #ddd;\n    }\n    \n    .table__cell {\n        color: #222 ;\n        padding: 3px 15px 4px 15px;  \n    }\n    \n    .table__cell--right-aligned {\n        text-align: right;\n    }\n    \n    .table__cell.vat-code{\n        text-align: center;\n    }\n    \n    .table__cell.summary__vat-code{\n        width: 154px;\n    }\n    \n    .table__cell.summary__vat-description{\n        width: 350px;\n    }\n    \n    .table__cell.summary__vat-rate{\n        text-align: center;\n        width: 128px;\n    }\n\n    .table-summary>tfoot {\n      font-weight: bold;\n    }\n         \n    .table__foot-cell {\n      font-weight: bold;\n      padding-top: 10px;\n      vertical-align: middle;\n    }";
        var footerRules = "\n    .report-footer-container {\n      color: #aaa;\n      width: 100%;\n    }\n\n    .report-footer {\n      width: 100%;\n    }\n  \n    .report-footer-cel--left-aligned {\n        text-align: left;\n    }\n    \n    .report-footer-cel--centrally-aligned {\n        text-align: center;\n    }\n    \n    .report-footer-cel--right-aligned {\n        text-align: right;\n    }";
        this.addCssRule(domDocument, style, [
            headBreakRule,
            bodyRule,
            reportHeaderRule,
            tableRules,
            footerRules,
        ]);
        head.appendChild(style);
        domDocument.documentElement.appendChild(head);
        domDocument.documentElement.appendChild(body);
        body.innerHTML = document.getElementsByClassName('report-items-list')[0].innerHTML;
        this.removeElementsByClass(domDocument, 'report-footer-container');
        return {
            html: domDocument.documentElement.innerHTML,
            footer: this.getReportFooter()
        };
    };
    CorrispettiviContentComponent.prototype.addCssRule = function (domDocument, style, cssRules) {
        cssRules.forEach(function (cssRule) {
            style.appendChild(domDocument.createTextNode(cssRule));
        });
    };
    CorrispettiviContentComponent.prototype.removeElementsByClass = function (domDocument, className) {
        var elements = domDocument.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    };
    CorrispettiviContentComponent.prototype.getReportFooter = function () {
        var footer = "\n    <div>\n      <table style=\"width:100%; font-size:12px; color: #aaa; font-family: arial, helvetica, sans-serif;\">\n          <tr>\n              <td style=\"text-align: left;\">" + this.data.year + "/{#pageNum}</td>\n              <td style=\"text-align: left;\">" + this.data.agreement.company.name + "</td>\n              <td style=\"text-align: right;\"> P. IVA " + this.data.agreement.company.vatNumber + "</td>\n          </tr>\n      </table>\n    </div>";
        return footer;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CorrispettiviContentComponent.prototype, "agreementInfo", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CorrispettiviContentComponent.prototype, "data", void 0);
    CorrispettiviContentComponent = __decorate([
        core_1.Component({
            selector: 'app-corrispettivi-content',
            templateUrl: './corrispettivi-content.component.html',
            styleUrls: ['./corrispettivi-content.component.css']
        }),
        __metadata("design:paramtypes", [export_to_excel_service_1.ExportToExcelService,
            export_to_pdf_service_1.ExportToPdfService])
    ], CorrispettiviContentComponent);
    return CorrispettiviContentComponent;
}());
exports.CorrispettiviContentComponent = CorrispettiviContentComponent;
//# sourceMappingURL=corrispettivi-content.component.js.map