import { BrowserModule } from '@angular/platform-browser';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { itLocale } from 'ngx-bootstrap/locale';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProgressbarModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppRoutingModule } from './app-routing.module';

import { AgreementService } from './services/agreement.service';
import { ApplicationVersionService } from './services/application-version.service';
import { DialogOkCancelService } from './services/dialog-ok-cancel.service';
import { ExportToExcelService } from './services/export-to-excel.service';
import { ExportToPdfService } from './services/export-to-pdf.service';
import { GrantTokenService } from './services/grant-token.service';
import { QueryParametersService } from './services/query-parameters.service';
import { ReportsService } from './services/reports.service';
import { RevisoNumberSeriesService } from './services/reviso-number-series.service';
import { RevisoReportsApiService } from './services/reviso-reports-api.service';
import { RevisoVatAccountsService } from './services/reviso-vat-accounts.service'

import { AppComponent } from './app.component';
import { CorrispettiviReportComponent } from './corrispettivi/corrispettivi-report/corrispettivi-report.component';
import { MultiSelectDropdownComponent } from './multi-select-dropdown/multi-select-dropdown.component';
import { UnexpectedErrorComponent } from './unexpected-error/unexpected-error.component';
import { ReportsHomeComponent } from './reports-home/reports-home.component';

import { ReportHostDirective } from './directives/report-host.directive';
import { ReportContentHostDirective } from './directives/report-content-host.directive';
import { CorrispettiviContentComponent } from './corrispettivi/corrispettivi-content/corrispettivi-content.component';
import { LoadingComponent } from './loading/loading.component';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';


registerLocaleData(localeIt, 'it-IT');

defineLocale('it', itLocale);

@NgModule({
    declarations: [
        AppComponent,
        CorrispettiviContentComponent,
        CorrispettiviReportComponent,
        MultiSelectDropdownComponent,
        ReportContentHostDirective,
        ReportHostDirective,
        ReportsHomeComponent,
        UnexpectedErrorComponent,
        LoadingComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        ButtonsModule.forRoot(),
        CollapseModule.forRoot(),
        FormsModule,
        HttpClientModule,
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        ProgressbarModule.forRoot(),
        ReactiveFormsModule,
        TooltipModule.forRoot()
    ],
    providers: [
        AgreementService,
        ApplicationVersionService,
        BsLocaleService,
        BsModalRef,
        BsModalService,
        DialogOkCancelService,
        ExportToExcelService,
        ExportToPdfService,
        GrantTokenService,
        QueryParametersService,
        ReportsService,
        RevisoNumberSeriesService,
        RevisoReportsApiService,
        RevisoVatAccountsService,
    ],
    entryComponents: [
        CorrispettiviContentComponent,
        CorrispettiviReportComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
