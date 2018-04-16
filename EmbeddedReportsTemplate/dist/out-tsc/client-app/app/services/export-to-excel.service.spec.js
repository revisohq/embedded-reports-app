"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var export_to_excel_service_1 = require("./export-to-excel.service");
describe('ExportToExcelService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [export_to_excel_service_1.ExportToExcelService]
        });
    });
    it('should be created', testing_1.inject([export_to_excel_service_1.ExportToExcelService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=export-to-excel.service.spec.js.map