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
var operators_1 = require("rxjs/operators");
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var handle_error_1 = require("../handle-error");
var of_1 = require("rxjs/observable/of");
var ApplicationVersionService = /** @class */ (function () {
    function ApplicationVersionService(_httpClient) {
        this._httpClient = _httpClient;
    }
    ApplicationVersionService_1 = ApplicationVersionService;
    ApplicationVersionService.prototype.getApplicationVersion = function () {
        var hostName = window.location.host;
        if (hostName.indexOf('localhost') >= 0 || hostName.indexOf('test') >= 0) {
            return this._httpClient.get('/api/version')
                .pipe(operators_1.tap(function (_) { return console.log("Fetched application version."); }), operators_1.catchError(handle_error_1.handleHttpError(ApplicationVersionService_1.name, 'getApplicationVersion')));
        }
        else {
            return of_1.of({
                major: 0,
                minor: 0,
                patch: 0,
            });
        }
    };
    ApplicationVersionService = ApplicationVersionService_1 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ApplicationVersionService);
    return ApplicationVersionService;
    var ApplicationVersionService_1;
}());
exports.ApplicationVersionService = ApplicationVersionService;
//# sourceMappingURL=application-version.service.js.map