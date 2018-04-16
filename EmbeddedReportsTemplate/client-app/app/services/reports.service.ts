import { Injectable } from '@angular/core';
import { Report } from '../shared/report';

import { CorrispettiviReportComponent } from '../corrispettivi/corrispettivi-report/corrispettivi-report.component';
import { CorrispettiviContentComponent } from '../corrispettivi/corrispettivi-content/corrispettivi-content.component';
import { CorrispettiviDataProvider } from '../corrispettivi/corrispettivi-data-provider';
import { DataTransformer } from '../corrispettivi/data-transformer';

import { RevisoReportsApiService } from './reviso-reports-api.service';
import { RevisoVatAccountsService } from './reviso-vat-accounts.service';
import { RevisoNumberSeriesService } from './reviso-number-series.service';
import { AgreementService } from './agreement.service';

@Injectable()
export class ReportsService {
  private _reports: Array<Report>

  constructor(
    private _agreementService: AgreementService,
    private _reportApiService: RevisoReportsApiService,
    private _revisoNumberSeriesService: RevisoNumberSeriesService,
    private _revisoVatAccountsService: RevisoVatAccountsService
  ) {
    this._reports = [
      new Report(CorrispettiviReportComponent,
        CorrispettiviContentComponent,
        new CorrispettiviDataProvider(
          this._agreementService, 
          this._revisoNumberSeriesService , 
          this._reportApiService, 
          _revisoVatAccountsService),
        new DataTransformer(),
        { name: "corrispettivi", filter: {}, title: "Registro IVA corrispettivi" }),
    ];
  }

  getReports(): Array<Report> {
    return this._reports;
  }

  getReportByName(reportName: string): Report {
    return this._reports.find(r => r.data.name === reportName);
  }

}
