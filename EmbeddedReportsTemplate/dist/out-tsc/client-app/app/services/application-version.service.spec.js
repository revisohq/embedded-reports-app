"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var application_version_service_1 = require("./application-version.service");
describe('ApplicationVersionService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [application_version_service_1.ApplicationVersionService]
        });
    });
    it('should be created', testing_1.inject([application_version_service_1.ApplicationVersionService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=application-version.service.spec.js.map