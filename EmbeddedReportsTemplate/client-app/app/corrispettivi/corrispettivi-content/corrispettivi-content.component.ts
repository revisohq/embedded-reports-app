import {
  Component,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';


import { ExportToExcelService } from '../../services/export-to-excel.service';
import { ExportToPdfService } from '../../services/export-to-pdf.service';

import { ICorrispettiviContent } from './corrispettivi-content';

import { ReportContentBaseComponent } from '../../shared/report-content-base-component';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-corrispettivi-content',
  templateUrl: './corrispettivi-content.component.html',
  styleUrls: ['./corrispettivi-content.component.css']
})
export class CorrispettiviContentComponent implements ReportContentBaseComponent, OnInit {

  @Input() agreementInfo: any;
  @Input() data: any;

  constructor(
    private _exportToExcelService: ExportToExcelService,
    private _exportToPdfService: ExportToPdfService
  ) { }

  ngOnInit() {
    this.data = {
      pages: []
    }
  }

  getPageNumberSeriesName(page): string {
    return page.numberSeriesName ? page.numberSeriesName : page.numberSeriesPrefix;
  }

  getFinalSummaryPageNumber(): number {
    return this.data ? this.data.pages.length + 1 : 0;
  }

  exportToExcel(): Observable<any> {
    if (this.data) {
      return this._exportToExcelService.export(this.data);
    } else {
      return of(null)
    }
  }

  exportToPdf(): Observable<any> {
    if (this.data) {
      let content = this.getContentForPdf()
      return this._exportToPdfService.export(content);
    } else {
      return of(null)
    }
  }

  getFileName(): string {
    return this.data != null ? `RegistroIvaCorrispettivi_${this.data.period}` : 'export';
  }

  private getContentForPdf(): any {

    let docType = document.implementation.createDocumentType('html', '', '');
    let domDocument = document.implementation.createDocument('', 'html', docType);
    let head = domDocument.createElement('head');
    let body = domDocument.createElement('body');
    let style = domDocument.createElement('style');

    const headBreakRule = `
      .page-break__header {
        page-break-before: always;
      }`;

    const bodyRule = `
    body {
      font-size:12px;
    }`;

    const reportHeaderRule = `
    .table-header {
      font-family: helvetica, arial, sans-serif;
      width: 100%;
    }
    
    .header__right {
      text-align: right;
      line-height: 1.4;
    }

    .period-container {
      margin-top: 20px;
      color: #757575;
    }
  
    h4 {
        margin-top: 10px;
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: 500;
    }`;

    const tableRules = `
      table {  
        border-spacing: 0px;
        margin-top: 20px;  
        font-family: arial, helvetica, sans-serif;
        width: 100%;
        max-width: 100%;
        margin-bottom: 20px;    
        font-size: 12px;
      }
    
    table caption {
      font-weight: bold;
      color: black;
      background-color: #F3F3F3;
      padding-left: 15px;
      text-align: left;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    
    thead {
        background-color: #F3F3F3; 
        text-align: left;
    }
    
    .table__header-cell{
        border-bottom: none;
        height: 32px;
        vertical-align: top;
    }

    .table__body-cell {
      border-bottom-style: solid;
      border-bottom-width: 1px;
      border-bottom-color: #ddd;
    }
    
    .table__cell {
        color: #222 ;
        padding: 3px 15px 4px 15px;  
    }
    
    .table__cell--right-aligned {
        text-align: right;
    }
    
    .table__cell.vat-code{
        text-align: center;
    }
    
    .table__cell.summary__vat-code{
        width: 154px;
    }
    
    .table__cell.summary__vat-description{
        width: 350px;
    }
    
    .table__cell.summary__vat-rate{
        text-align: center;
        width: 128px;
    }

    .table-summary>tfoot {
      font-weight: bold;
    }
         
    .table__foot-cell {
      font-weight: bold;
      padding-top: 10px;
      vertical-align: middle;
    }`;

    const footerRules = `
    .report-footer-container {
      color: #aaa;
      width: 100%;
    }

    .report-footer {
      width: 100%;
    }
  
    .report-footer-cel--left-aligned {
        text-align: left;
    }
    
    .report-footer-cel--centrally-aligned {
        text-align: center;
    }
    
    .report-footer-cel--right-aligned {
        text-align: right;
    }`;

    this.addCssRule(domDocument, style, [
      headBreakRule,
      bodyRule,
      reportHeaderRule,
      tableRules,
      footerRules,
    ])

    head.appendChild(style);
    domDocument.documentElement.appendChild(head);
    domDocument.documentElement.appendChild(body);
    body.innerHTML = document.getElementsByClassName('report-items-list')[0].innerHTML;

    this.removeElementsByClass(domDocument, 'report-footer-container')

    return {
      html: domDocument.documentElement.innerHTML,
      footer: this.getReportFooter()
    }
  }

  private addCssRule(domDocument: Document, style: HTMLStyleElement, cssRules: Array<string>): void {
    cssRules.forEach(cssRule => {
      style.appendChild(domDocument.createTextNode(cssRule))
    })

  }

  private removeElementsByClass(domDocument: Document, className: string): void {
    var elements = domDocument.getElementsByClassName(className);
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  private getReportFooter(): string {
    let footer = `
    <div>
      <table style="width:100%; font-size:12px; color: #aaa; font-family: arial, helvetica, sans-serif;">
          <tr>
              <td style="text-align: left;">${this.data.year}/{#pageNum}</td>
              <td style="text-align: left;">${this.data.agreement.company.name}</td>
              <td style="text-align: right;"> P. IVA ${this.data.agreement.company.vatNumber}</td>
          </tr>
      </table>
    </div>`;

    return footer;
  }

}
