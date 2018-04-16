"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var dialog_ok_cancel_service_1 = require("./dialog-ok-cancel.service");
describe('DialogOkCancelService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [dialog_ok_cancel_service_1.DialogOkCancelService]
        });
    });
    it('should be created', testing_1.inject([dialog_ok_cancel_service_1.DialogOkCancelService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=dialog-ok-cancel.service.spec.js.map