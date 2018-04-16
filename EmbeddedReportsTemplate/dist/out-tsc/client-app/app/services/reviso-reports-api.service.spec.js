"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var reviso_reports_api_service_1 = require("./reviso-reports-api.service");
describe('RevisoReportsApiService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [reviso_reports_api_service_1.RevisoReportsApiService]
        });
    });
    it('should be created', testing_1.inject([reviso_reports_api_service_1.RevisoReportsApiService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=reviso-reports-api.service.spec.js.map