"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var grant_token_service_1 = require("./grant-token.service");
describe('GrantTokenService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [grant_token_service_1.GrantTokenService]
        });
    });
    it('should be created', testing_1.inject([grant_token_service_1.GrantTokenService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=grant-token.service.spec.js.map