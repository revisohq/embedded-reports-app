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
var grant_token_service_1 = require("./grant-token.service");
var handle_error_1 = require("../handle-error");
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var ExportToExcelService = /** @class */ (function () {
    function ExportToExcelService(_httpClient, _grantTokenService) {
        this._httpClient = _httpClient;
        this._grantTokenService = _grantTokenService;
    }
    ExportToExcelService_1 = ExportToExcelService;
    ExportToExcelService.prototype.export = function (data) {
        return this._httpClient.post('/api/exportcorrispettivitoexcel', data, {
            headers: {
                'x-embedded-reports-template-grant-token': this._grantTokenService.grantToken,
            },
            responseType: 'blob',
        }).pipe(operators_1.tap(function (response) { return console.log(response); }), operators_1.catchError(handle_error_1.handleHttpError(ExportToExcelService_1.name, 'export')));
    };
    ExportToExcelService = ExportToExcelService_1 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient,
            grant_token_service_1.GrantTokenService])
    ], ExportToExcelService);
    return ExportToExcelService;
    var ExportToExcelService_1;
}());
exports.ExportToExcelService = ExportToExcelService;
//# sourceMappingURL=export-to-excel.service.js.map