import { Observable } from "rxjs/Observable";

export interface IDataProvider {
    getReportData(filter: any):  Observable<any>;
}