"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var reports_service_1 = require("./reports.service");
describe('ReportsService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [reports_service_1.ReportsService]
        });
    });
    it('should be created', testing_1.inject([reports_service_1.ReportsService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=reports.service.spec.js.map