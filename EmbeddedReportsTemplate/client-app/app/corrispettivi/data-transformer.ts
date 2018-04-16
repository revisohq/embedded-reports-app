import { last } from "rxjs/operators";
import { group } from "@angular/core";

import { IDataTransformer } from "../shared/data-transformer";
import { IRevisoVatAccount } from "../shared/reviso-vat-account";
import { IRevisoEntryLine } from "../shared/reviso-entry-line";
import { ICorrispettiviContent, IVatGroupItem } from "./corrispettivi-content/corrispettivi-content";
import { PeriodEnum } from "../shared/period-enum";


export class DataTransformer implements IDataTransformer {

    private _maxRowsPerPage: number = 13;
    constructor() { }

    transform(source: any, filter: any): any {

        let [agreement, vatAccounts, entries, numberSeries] = source

        if (entries && entries.length) {
            let sortedData = entries
                .filter(entry => entry.entryType == 'financeVoucher')
                .sort((line1, line2) => {
                    const date1 = new Date(line1.date);
                    const date2 = new Date(line2.date);

                    return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
                });

            let groupedData: Array<ICorrispettiviContent> = this.groupData(sortedData, numberSeries, vatAccounts);

            let pages: Array<any> = this.getPagedData(groupedData);
            let summary: any = this.getSummary(pages);

            return {
                year: filter.year,
                period: this.getPeriod(filter),
                agreement: agreement,
                numberSeries: numberSeries,
                pages: pages,
                finalSummary: summary.rows,
                finalSummaryTotals: summary.totals,
            };
        } else {
            return {
                year: filter.year,
                period: this.getPeriod(filter),
                agreement: agreement,
                numberSeries: numberSeries,
                pages: [],
                finalSummary: [],
                finalSummaryTotals: [],
            };
        }



    }

    private groupData(entries: Array<any>, numberSeriesCollection: Array<any>, vatAccounts: Array<any>): Array<any> {

        return entries.reduce((groups, line) => {
            let numberSeries = numberSeriesCollection.find(item => item.prefix == line.numberSeries.prefix);
            let vatAccount: IRevisoVatAccount = !this.isFinancialAccountLine(line)
                ? vatAccounts.find(vatAccount => vatAccount.vatCode == line.vatCode.trim())
                : null;

            let numberSeriesGroup = groups.find(group => group.numberSeriesPrefix == line.numberSeries.prefix);
            if (numberSeriesGroup) {
                let dayGroup = numberSeriesGroup.dailyRegistrations.find(registration => registration.day == line.date);
                if (dayGroup) {
                    if (this.isFinancialAccountLine(line)) {
                        dayGroup.total += line.amount;
                    } else {
                        let vatGroup = dayGroup.vatGroups.find(group => group.vatCode == line.vatCode.trim());
                        if (vatGroup) {
                            this.isVatLine(line) ? vatGroup.vat += -line.amount : vatGroup.amount += -line.amount;
                            vatGroup.total += -line.amount;
                        } else {
                            vatGroup = {
                                amount: this.isAmountLine(line) ? -line.amount : 0,
                                total: -line.amount,
                                vat: this.isVatLine(line) ? -line.amount : 0,
                                vatCode: line.vatCode.trim(),
                                vatDescription: !this.isFinancialAccountLine(line) ? vatAccount.name : null,
                                ratePercentage: !this.isFinancialAccountLine(line) ? vatAccount.ratePercentage : null,
                            };

                            dayGroup.vatGroups.push(vatGroup);
                            dayGroup.vatGroups = dayGroup.vatGroups.sort((vatGroup1, vatGroup2) => {
                                return vatGroup1.vatCode > vatGroup2.vatCode
                                    ? 1
                                    : (vatGroup1.vatCode < vatGroup2.vatCode ? -1 : 0);
                            });
                        }
                    }
                } else {
                    dayGroup = {
                        day: line.date,
                        description: 'Incasso del giorno',
                        total: this.isFinancialAccountLine(line) ? line.amount : 0,
                        vatGroups: !this.isFinancialAccountLine(line)
                            ? [
                                {
                                    amount: this.isAmountLine(line) ? -line.amount : 0,
                                    total: -line.amount,
                                    vat: this.isVatLine(line) ? -line.amount : 0,
                                    vatCode: line.vatCode.trim(),
                                    vatDescription: !this.isFinancialAccountLine(line) ? vatAccount.name : null,
                                    ratePercentage: !this.isFinancialAccountLine(line) ? vatAccount.ratePercentage : null,
                                }
                            ]
                            : <IVatGroupItem[]>[]
                    };

                    numberSeriesGroup.dailyRegistrations.push(dayGroup);
                }
            } else {
                numberSeriesGroup = {
                    numberSeriesPrefix: line.numberSeries.prefix,
                    numberSeriesName: numberSeries != null ? numberSeries.name : null,
                    dailyRegistrations: [
                        {
                            day: line.date,
                            description: 'Incasso del giorno',
                            total: this.isFinancialAccountLine(line) ? line.amount : 0,
                            vatGroups: !this.isFinancialAccountLine(line)
                                ? [
                                    {
                                        amount: this.isAmountLine(line) ? -line.amount : 0,
                                        total: -line.amount,
                                        vat: this.isVatLine(line) ? -line.amount : 0,
                                        vatCode: line.vatCode.trim(),
                                        vatDescription: !this.isFinancialAccountLine(line) ? vatAccount.name : null,
                                        ratePercentage: !this.isFinancialAccountLine(line) ? vatAccount.ratePercentage : null,
                                    }
                                ]
                                : <IVatGroupItem[]>[]
                        }
                    ]
                }

                groups.push(numberSeriesGroup);
            }

            return groups;

        }, <ICorrispettiviContent[]>[])
    }

    private getSummary(reportPages: Array<any>): any {
        let rows = reportPages
            .filter(page => page.summary != null)
            .reduce((group, currentPage) => {
                currentPage.summary.forEach(vatGroup => {
                    let summaryGroup = group.find(item => item.vatCode == vatGroup.vatCode);
                    if (summaryGroup) {
                        summaryGroup.amount += vatGroup.amount;
                        summaryGroup.vat += vatGroup.vat;
                        summaryGroup.total += vatGroup.total;
                    } else {
                        summaryGroup = {
                            vatCode: vatGroup.vatCode,
                            vatDescription: vatGroup.vatDescription,
                            ratePercentage: vatGroup.ratePercentage,
                            amount: vatGroup.amount,
                            vat: vatGroup.vat,
                            total: vatGroup.total
                        }

                        group.push(summaryGroup);
                    }
                });

                return group;
            }, [])
            .sort((vatGroup1, vatGroup2) => {
                return vatGroup1.vatCode > vatGroup2.vatCode
                    ? 1
                    : (vatGroup1.vatCode < vatGroup2.vatCode ? -1 : 0);
            });

        let totals = rows.reduce((totals, row) => {
            totals.amount += row.amount;
            totals.vat += row.vat;
            totals.total += row.total;

            return totals;
        }, { amount: 0, vat: 0, total: 0 })

        return {
            rows,
            totals
        }
    }

    private getPeriod(filter): string {
        let year: number = filter.year;

        switch (filter.period) {
            case PeriodEnum.January:
            case PeriodEnum.February:
            case PeriodEnum.March:
            case PeriodEnum.April:
            case PeriodEnum.May:
            case PeriodEnum.June:
            case PeriodEnum.July:
            case PeriodEnum.August:
            case PeriodEnum.September:
            case PeriodEnum.October:
            case PeriodEnum.November:
            case PeriodEnum.December:
                return `${this.getMonthName(filter.period - 1)} - ${year}`
            case PeriodEnum.FirstQuarter:
                return `T1 - Primo trimestre - ${year}`;
            case PeriodEnum.SecondQuarter:
                return `T2 - Secondo trimestre - ${year}`;
            case PeriodEnum.ThirdQuarter:
                return `T3 - Terzo trimestre - ${year}`;
            case PeriodEnum.FourthQuarter:
                return `T4 - Quarto trimestre - ${year}`;
            case PeriodEnum.Yearly:
                return `Annuale - ${year}`;
            default:
                break;
        }

    }

    private getMonthName(monthNumber: number): string {
        let monthNames = [
            "Gennaio",
            "Febbraio",
            "Marzo",
            "Aprile",
            "Maggio",
            "Giugno",
            "Luglio",
            "Agosto",
            "Settembre",
            "Ottobre",
            "Novembre",
            "Dicembre"
        ];

        return monthNames[monthNumber];
    }

    private isFinancialAccountLine(entryLine: IRevisoEntryLine): boolean {
        return entryLine.vatCode == null;
    }

    private isVatLine(entryLine: IRevisoEntryLine): boolean {
        return entryLine.vatLine;
    }

    private isAmountLine(entryLine: IRevisoEntryLine): boolean {
        return entryLine.vatCode && !entryLine.vatLine;
    }

    private getPagedData(groupedData: ICorrispettiviContent[]) {
        let pages: Array<any> = [];
        for (let index = 0; index < groupedData.length; index++) {
            const numberSeriesGroup = groupedData[index];
            let numberSeriesPages = numberSeriesGroup.dailyRegistrations.reduce((pages, dailyGroup, index) => {
                let lastPage = pages.find(page => page.numberSeriesPrefix == numberSeriesGroup.numberSeriesPrefix &&
                    page.rows.length < this._maxRowsPerPage);
                let currentPage;
                if (lastPage == null) {
                    currentPage = {
                        numberSeriesPrefix: numberSeriesGroup.numberSeriesPrefix,
                        numberSeriesName: numberSeriesGroup.numberSeriesName,
                        rows: []
                    };
                    pages.push(currentPage);
                }
                else {
                    currentPage = lastPage;
                }
                currentPage.rows.push({
                    day: dailyGroup.day,
                    description: dailyGroup.description,
                    dailyTotal: dailyGroup.total,
                    vatDescription: null,
                    ratePercentage: null,
                    vatCode: null,
                    amount: null,
                    vat: null,
                    total: null,
                });
                dailyGroup.vatGroups.forEach((vatGroup) => {
                    if (currentPage.rows == this._maxRowsPerPage) {
                        currentPage = { numberSeriesPrefix: numberSeriesGroup.numberSeriesPrefix, rows: [] };
                    }
                    currentPage.rows.push({
                        day: null,
                        description: null,
                        dailyTotal: null,
                        vatCode: vatGroup.vatCode,
                        vatDescription: vatGroup.vatDescription,
                        ratePercentage: vatGroup.ratePercentage,
                        amount: vatGroup.amount,
                        vat: vatGroup.vat,
                        total: vatGroup.total,
                    });
                });
                return pages;
            }, []);

            this.createNumberSeriesSummary(numberSeriesPages);
            pages = pages.concat(numberSeriesPages);
        }

        return pages;
    }

    private createNumberSeriesSummary(numberSeriesPages: Array<any>): void {

        let summary: Array<any> = numberSeriesPages.reduce((numberSeriesSummary, page) => {

            let pageSummary: Array<any> = page.rows.reduce((pageSummary, pageRow, index) => {
                if (!pageRow.vatCode) {
                    return pageSummary;
                }

                let vatGroup = pageSummary.find(group => group.vatCode == pageRow.vatCode);
                if (vatGroup == null) {
                    vatGroup = {
                        vatCode: pageRow.vatCode,
                        vatDescription: pageRow.vatDescription,
                        ratePercentage: pageRow.ratePercentage,
                        amount: pageRow.amount,
                        vat: pageRow.vat,
                        total: pageRow.total
                    }

                    pageSummary.push(vatGroup);
                } else {
                    vatGroup.amount += pageRow.amount;
                    vatGroup.vat += pageRow.vat;
                    vatGroup.total += pageRow.total;
                }

                return pageSummary

            }, []);

            pageSummary.forEach(pageVatGroup => {
                let numberSeriesVatGroup = numberSeriesSummary.find(vatGroup => vatGroup.vatCode == pageVatGroup.vatCode);
                if (numberSeriesVatGroup == null) {
                    numberSeriesVatGroup = {
                        vatCode: pageVatGroup.vatCode,
                        vatDescription: pageVatGroup.vatDescription,
                        ratePercentage: pageVatGroup.ratePercentage,
                        amount: pageVatGroup.amount,
                        vat: pageVatGroup.vat,
                        total: pageVatGroup.total
                    }

                    numberSeriesSummary.push(numberSeriesVatGroup);
                } else {
                    numberSeriesVatGroup.amount += pageVatGroup.amount;
                    numberSeriesVatGroup.vat += pageVatGroup.vat;
                    numberSeriesVatGroup.total += pageVatGroup.total;
                }
            });

            return numberSeriesSummary.sort((vatGroup1, vatGroup2) => {
                return vatGroup1.vatCode > vatGroup2.vatCode
                    ? 1
                    : (vatGroup1.vatCode < vatGroup2.vatCode 
                        ? -1 
                        : 0
                    );
            });
        }, []);

        let lastPage = numberSeriesPages[numberSeriesPages.length - 1];
        let summaryTotals = this.getPageSummaryTotal(summary)

        if (this.pageHasEnoughSpace(lastPage, summary)) {
            lastPage.summary = summary;
            lastPage.summaryAmount = summaryTotals.amount;
            lastPage.summaryVat = summaryTotals.vat;
            lastPage.summaryTotal = summaryTotals.total;
        } else {
            numberSeriesPages.push({
                numberSeriesPrefix: lastPage.numberSeriesPrefix,
                summary: summary,
                summaryAmount: summaryTotals.amount,
                summaryVat: summaryTotals.vat,
                summaryTotal: summaryTotals.total,
            });
        }

    }

    private getPageSummaryTotal(pageSummary: Array<any>): any {

        return pageSummary.reduce((sum, summaryRow) => {
            sum.amount += summaryRow.amount;
            sum.vat += summaryRow.vat;
            sum.total += summaryRow.total;

            return sum;
        }, { amount: 0, vat: 0, total: 0 });
    }

    private pageHasEnoughSpace(page, rows: Array<any>): boolean {
        return (this._maxRowsPerPage - page.rows.length) > rows.length;
    }
}


