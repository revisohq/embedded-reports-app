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
var GrantTokenService = /** @class */ (function () {
    function GrantTokenService(_http) {
        this._http = _http;
    }
    GrantTokenService_1 = GrantTokenService;
    Object.defineProperty(GrantTokenService.prototype, "grantToken", {
        get: function () {
            return this._grantToken;
        },
        enumerable: true,
        configurable: true
    });
    GrantTokenService.prototype.getGrantToken = function (embeddedAppToken) {
        var _this = this;
        return this._http.get("/api/grant/" + embeddedAppToken).pipe(operators_1.tap(function (token) { return _this._grantToken = token; }), operators_1.catchError(handle_error_1.handleHttpError(GrantTokenService_1.name, 'getGrantToken')));
    };
    GrantTokenService = GrantTokenService_1 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], GrantTokenService);
    return GrantTokenService;
    var GrantTokenService_1;
}());
exports.GrantTokenService = GrantTokenService;
//# sourceMappingURL=grant-token.service.js.map