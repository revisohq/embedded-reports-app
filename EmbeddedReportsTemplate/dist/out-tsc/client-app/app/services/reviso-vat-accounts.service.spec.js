"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var reviso_vat_accounts_service_1 = require("./reviso-vat-accounts.service");
describe('RevisoVatAccountsService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [reviso_vat_accounts_service_1.RevisoVatAccountsService]
        });
    });
    it('should be created', testing_1.inject([reviso_vat_accounts_service_1.RevisoVatAccountsService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=reviso-vat-accounts.service.spec.js.map