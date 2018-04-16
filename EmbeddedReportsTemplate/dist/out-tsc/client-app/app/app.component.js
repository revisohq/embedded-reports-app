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
var common_1 = require("@angular/common");
var http_1 = require("@angular/http");
var environment_1 = require("../environments/environment");
var agreement_service_1 = require("./services/agreement.service");
var application_version_service_1 = require("./services/application-version.service");
var grant_token_service_1 = require("./services/grant-token.service");
var query_parameters_service_1 = require("./services/query-parameters.service");
var AppComponent = /** @class */ (function () {
    function AppComponent(_agreementService, _applicationVersionService, _grantTokenService, _queryParametersService, _location) {
        this._agreementService = _agreementService;
        this._applicationVersionService = _applicationVersionService;
        this._grantTokenService = _grantTokenService;
        this._queryParametersService = _queryParametersService;
        this._location = _location;
        this.unauthorized = true;
        this.authorizing = true;
        this.applicationVersion = {
            major: 0,
            minor: 0,
            patch: 0
        };
        this.clientAppIsProduction = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.clientAppIsProduction = environment_1.environment.production;
        this.authorizing = true;
        var hashParts = window.location.hash.split('?');
        var reportName = hashParts[0].slice(2);
        console.log("app started with report: " + reportName);
        var eat = null;
        if (hashParts.length === 2) {
            eat = new http_1.URLSearchParams(hashParts[1]).get('embeddedAppToken');
        }
        this._grantTokenService.getGrantToken(eat).subscribe(function (token) {
            _this._agreementService.getRevisoAgreement().subscribe(function (agreement) {
                _this.unauthorized = false;
                _this.authorizing = false;
            });
        }, function (error) {
            _this.unauthorized = true;
            _this.authorizing = false;
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }),
        __metadata("design:paramtypes", [agreement_service_1.AgreementService,
            application_version_service_1.ApplicationVersionService,
            grant_token_service_1.GrantTokenService,
            query_parameters_service_1.QueryParametersService,
            common_1.Location])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map