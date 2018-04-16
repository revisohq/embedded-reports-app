import { Type } from '@angular/core';

import { ReportBaseComponent } from './report-base-component';
import { ReportContentBaseComponent } from './report-content-base-component';

import { IDataProvider } from './data-provider';
import { IDataTransformer } from './data-transformer';
import { IReportData } from './report-data';

export class Report {
    constructor(
        public component: Type<ReportBaseComponent>, 
        public contentComponent: Type<ReportContentBaseComponent> , 
        public dataProvider: IDataProvider,
        public dataTransformer: IDataTransformer,
        public data: IReportData){}
}