"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var query_parameters_service_1 = require("./query-parameters.service");
describe('QueryParametersService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [query_parameters_service_1.QueryParametersService]
        });
    });
    it('should be created', testing_1.inject([query_parameters_service_1.QueryParametersService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=query-parameters.service.spec.js.map