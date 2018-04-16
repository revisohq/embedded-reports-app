"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var agreement_service_1 = require("./agreement.service");
describe('AgreementService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [agreement_service_1.AgreementService]
        });
    });
    it('should be created', testing_1.inject([agreement_service_1.AgreementService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=agreement.service.spec.js.map