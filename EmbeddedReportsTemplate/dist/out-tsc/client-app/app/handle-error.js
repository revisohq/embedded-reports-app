"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/throw");
exports.handleHttpError = function (context, operation) {
    return function (error) {
        console.error(context + "." + operation + ":" + error.message);
        return Observable_1.Observable.throw(new Error(error.message));
    };
};
//# sourceMappingURL=handle-error.js.map