import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { IPeriodsType } from '../../shared/period-type';
import { IRevisoNumberSeries } from '../../shared/reviso-number-series';
import { PeriodEnum } from '../../shared/period-enum';
import { ReportBaseComponent } from '../../shared/report-base-component';

import { IMultiSelectItem } from '../../shared/multi-select-item';
import { RevisoNumberSeriesService } from '../../services/reviso-number-series.service';
import { RevisoReportsApiService } from '../../services/reviso-reports-api.service';

@Component({
  selector: 'app-corrispettivi-report',
  templateUrl: './corrispettivi-report.component.html',
  styleUrls: ['./corrispettivi-report.component.css']
})
export class CorrispettiviReportComponent implements ReportBaseComponent, OnInit {

  @Input() name: string;
  @Input() filter: any;
  @Input() title: string;

  includeDraftEntries: boolean;
  numberSeries: Array<IMultiSelectItem>;
  periods: Array<IPeriodsType>;
  years: Array<number>;
  loadingNumberSeries: boolean;

  constructor(private _revisoNumberSeriesService: RevisoNumberSeriesService) { }

  ngOnInit() {
   
    this.setDefaultFilter();

    this.populateYears(2017, new Date().getFullYear());
    this.populatePeriods();

    this.numberSeries = [];
    this.loadNumberSeries();

  }

  print(): void {
    window.print();
  }

  shareCheckedList(items: Array<IRevisoNumberSeries>) {
    this.filter.numberSeries = items;
  }

  shareIndividualCheckedList(item: IRevisoNumberSeries) {
    //console.log(item);
  }

  clearFilter(): void {
    this.setDefaultFilter();

    this.numberSeries = this.numberSeries.slice(0); 
    this.numberSeries.forEach(item => item.selected = false);

    this.numberSeries[0].selected = true;
    this.filter.numberSeries = [this.numberSeries[0].value];
  }

  private setDefaultFilter(): void {
    const currentYear = (new Date()).getFullYear();
    const currentMonth = (new Date()).getMonth();

    this.filter = { year: currentYear, period:  (currentMonth + 1)};
  }

  private populatePeriods() {
    this.periods = [
      { description: 'Gennaio', value: PeriodEnum.January },
      { description: 'Febbraio', value: PeriodEnum.February },
      { description: 'Marzo', value: PeriodEnum.March },
      { description: 'Aprile', value: PeriodEnum.April },
      { description: 'Maggio', value: PeriodEnum.May },
      { description: 'Giugno', value: PeriodEnum.June },
      { description: 'Luglio', value: PeriodEnum.July },
      { description: 'Agosto', value: PeriodEnum.August },
      { description: 'Settembre', value: PeriodEnum.September },
      { description: 'Ottobre', value: PeriodEnum.October },
      { description: 'Novembre', value: PeriodEnum.November },
      { description: 'Dicembre', value: PeriodEnum.December },

      { description: 'T1 - Primo trimestre', value: PeriodEnum.FirstQuarter },
      { description: 'T2 - Secondo trimestre', value: PeriodEnum.SecondQuarter },
      { description: 'T3 - Terzo trimestre', value: PeriodEnum.ThirdQuarter },
      { description: 'T4 - Quarto trimestre', value: PeriodEnum.FourthQuarter },
      { description: 'Annuale', value: PeriodEnum.Yearly },
    ];
  }

  private populateYears(startYear: number, endYear: number) {
    this.years = new Array<number>(endYear - startYear + 1);
    for (let i = 0; i < this.years.length; i++) {
      this.years[i] = startYear + i;
    }
  }

  private loadNumberSeries(): void {
    this.loadingNumberSeries = true;

    this._revisoNumberSeriesService.getNumberSeries(null)
    .map(response => {
      return response.collection;
    })
    .subscribe(items => {
      this.numberSeries = items.map((item, index) => {
        return {
                selected: false,
                name: `${item.prefix} - ${item.name}`,
                value: item.prefix,
              };
      })
      .sort((item1, item2) => {
        return item1.name > item2.name ? 1 : item1.name < item2.name ? -1 : 0;
      });

      this.numberSeries[0].selected = true;
      this.filter.numberSeries = [this.numberSeries[0].value];

      this.loadingNumberSeries = false;
    })
  }

}
