"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var reviso_number_series_service_1 = require("./reviso-number-series.service");
describe('RevisoNumberSeriesService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [reviso_number_series_service_1.RevisoNumberSeriesService]
        });
    });
    it('should be created', testing_1.inject([reviso_number_series_service_1.RevisoNumberSeriesService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=reviso-number-series.service.spec.js.map