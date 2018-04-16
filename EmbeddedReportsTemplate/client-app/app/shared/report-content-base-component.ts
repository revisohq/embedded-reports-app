import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

export interface ReportContentBaseComponent {
    agreementInfo: any;
    data: any;
    exportToExcel(): Observable<any>;
    exportToPdf(): Observable<any>;
    getFileName(): string;
}