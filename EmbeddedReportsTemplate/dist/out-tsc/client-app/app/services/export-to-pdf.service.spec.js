"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var export_to_pdf_service_1 = require("./export-to-pdf.service");
describe('ExportToPdfService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [export_to_pdf_service_1.ExportToPdfService]
        });
    });
    it('should be created', testing_1.inject([export_to_pdf_service_1.ExportToPdfService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=export-to-pdf.service.spec.js.map