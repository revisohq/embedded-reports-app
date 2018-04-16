"use strict";
var jsreport = require("jsreport-core");
function pdfGenerator(callback, html, footer) {
    var reporter = jsreport();
    reporter.init().then(function () {
        return reporter.render({
            template: {
                content: html,
                engine: 'jsrender',
                recipe: 'phantom-pdf',
                phantom: {
                    format: 'A4',
                    orientation: 'landscape',
                    footer: footer
                }
            }
        }).then(function (resp) {
            callback(/* error */ null, resp.content.toJSON().data);
        });
    }).catch(function (e) {
        callback(/* error */ e, null);
    });
}
;
module.exports = pdfGenerator;
//# sourceMappingURL=PdfGenerator.js.map