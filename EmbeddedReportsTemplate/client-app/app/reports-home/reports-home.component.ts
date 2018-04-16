import { Component, OnInit, AfterViewInit, ViewChild, ComponentFactoryResolver, Type, ComponentRef } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

import * as FileSaver from 'file-saver';

import { Report } from '../shared/report';
import { ReportBaseComponent } from '../shared/report-base-component';
import { ReportContentBaseComponent } from '../shared/report-content-base-component';

import { ReportContentHostDirective } from '../directives/report-content-host.directive';
import { ReportHostDirective } from '../directives/report-host.directive';

import { ReportsService } from '../services/reports.service';


@Component({
  selector: 'app-reports-home',
  templateUrl: './reports-home.component.html',
  styleUrls: ['./reports-home.component.css']
})
export class ReportsHomeComponent implements OnInit, AfterViewInit {

  private _reportComponentRef: ComponentRef<ReportBaseComponent>;
  private _reportContentComponentRef: ComponentRef<ReportContentBaseComponent>;
  private _reportName: string;

  currentReport: Report;
  currentReportTitle: string;
  isCollapsed: boolean = false;
  dataAvailable: boolean = false;
  loading: boolean = false;

  @ViewChild(ReportHostDirective) reportHost: ReportHostDirective;
  @ViewChild(ReportContentHostDirective) reportContentHost: ReportContentHostDirective;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _reportsService: ReportsService,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._route.data.subscribe(
      value => this._reportName = value.reportName
    );
  }

  ngAfterViewInit() {

    if (this._reportName) {
      setTimeout(() => {
        this.loadReport(this._reportName);
      }, 0);
    }
  }

  loadReport(reportName: string): void {
    this.currentReport = this._reportsService.getReportByName(reportName);

    let reportComponentFactory = this._componentFactoryResolver.resolveComponentFactory<ReportBaseComponent>(this.currentReport.component);
    let reportContentComponentFactory = this._componentFactoryResolver.resolveComponentFactory<ReportContentBaseComponent>(this.currentReport.contentComponent);

    let reportViewContainerRef = this.reportHost.viewContainerRef;
    let reportContentViewContainerRef = this.reportContentHost.viewContainerRef;

    reportViewContainerRef.clear();
    reportContentViewContainerRef.clear();

    this._reportComponentRef = reportViewContainerRef.createComponent(reportComponentFactory);
    this._reportComponentRef.instance.filter = this.currentReport.data.filter;
    this._reportComponentRef.instance.name = this.currentReport.data.name;
    this._reportComponentRef.instance.title = this.currentReport.data.title;

    this.currentReportTitle = this.currentReport.data.title;

    this._reportContentComponentRef = reportContentViewContainerRef.createComponent(reportContentComponentFactory);
  }

  clearFilter(): void {
    this._reportComponentRef.instance.clearFilter();
  }

  getReportData(): void {

    this.loading = true;
    this.isCollapsed = true;

    this.currentReport.dataProvider.getReportData(this._reportComponentRef.instance.filter)
      .subscribe(data => {
        this.dataAvailable = this.dataCorrectlyLoaded(data);
        this.loading = false;

        this._reportContentComponentRef.instance.data = this.transformReportData(data);
      },
        error => this.handleError(error));
  }

  printReport(): void {
    this._reportComponentRef.instance.print();
  }

  exportToExcel(): void {
    this.loading = true;
    this.isCollapsed = true;

    let fileName = this._reportContentComponentRef.instance.getFileName();
    this._reportContentComponentRef.instance.exportToExcel().subscribe(
      response => {
        if (response != null) {
          FileSaver.saveAs(response, `${fileName}.xlsx`);
        }

        this.loading = false;
      },
      error => this.handleError(error));
  }

  exportToPdf(): void {
    this.loading = true;
    this.isCollapsed = true;

    let fileName = this._reportContentComponentRef.instance.getFileName();
    this._reportContentComponentRef.instance.exportToPdf().subscribe(
      response => {
        if (response != null) {
          FileSaver.saveAs(response, `${fileName}.pdf`);
        }

        this.loading = false;
      },
      error => this.handleError(error));
  }

  private dataCorrectlyLoaded(data: any): boolean {
    if (data instanceof Array) {
      return (<Array<any>>data).length != 0;
    } else {
      return data != null;
    }
  }

  private transformReportData(data: any): any {
    let transformedData = null;
    try {
      transformedData = this.currentReport.dataTransformer.transform(data, this._reportComponentRef.instance.filter);
    } catch (error) {
      console.error(error);
    }

    return transformedData;
  }

  private handleError(error: any): void {
    console.error(error);
  }

}
