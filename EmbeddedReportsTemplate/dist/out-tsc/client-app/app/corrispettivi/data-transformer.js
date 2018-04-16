"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var period_enum_1 = require("../shared/period-enum");
var DataTransformer = /** @class */ (function () {
    function DataTransformer() {
        this._maxRowsPerPage = 13;
    }
    DataTransformer.prototype.transform = function (source, filter) {
        var agreement = source[0], vatAccounts = source[1], entries = source[2], numberSeries = source[3];
        if (entries && entries.length) {
            var sortedData = entries
                .filter(function (entry) { return entry.entryType == 'financeVoucher'; })
                .sort(function (line1, line2) {
                var date1 = new Date(line1.date);
                var date2 = new Date(line2.date);
                return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
            });
            var groupedData = this.groupData(sortedData, numberSeries, vatAccounts);
            var pages = this.getPagedData(groupedData);
            var summary = this.getSummary(pages);
            return {
                year: filter.year,
                period: this.getPeriod(filter),
                agreement: agreement,
                numberSeries: numberSeries,
                pages: pages,
                finalSummary: summary.rows,
                finalSummaryTotals: summary.totals,
            };
        }
        else {
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
    };
    DataTransformer.prototype.groupData = function (entries, numberSeriesCollection, vatAccounts) {
        var _this = this;
        return entries.reduce(function (groups, line) {
            var numberSeries = numberSeriesCollection.find(function (item) { return item.prefix == line.numberSeries.prefix; });
            var vatAccount = !_this.isFinancialAccountLine(line)
                ? vatAccounts.find(function (vatAccount) { return vatAccount.vatCode == line.vatCode.trim(); })
                : null;
            var numberSeriesGroup = groups.find(function (group) { return group.numberSeriesPrefix == line.numberSeries.prefix; });
            if (numberSeriesGroup) {
                var dayGroup = numberSeriesGroup.dailyRegistrations.find(function (registration) { return registration.day == line.date; });
                if (dayGroup) {
                    if (_this.isFinancialAccountLine(line)) {
                        dayGroup.total += line.amount;
                    }
                    else {
                        var vatGroup = dayGroup.vatGroups.find(function (group) { return group.vatCode == line.vatCode.trim(); });
                        if (vatGroup) {
                            _this.isVatLine(line) ? vatGroup.vat += -line.amount : vatGroup.amount += -line.amount;
                            vatGroup.total += -line.amount;
                        }
                        else {
                            vatGroup = {
                                amount: _this.isAmountLine(line) ? -line.amount : 0,
                                total: -line.amount,
                                vat: _this.isVatLine(line) ? -line.amount : 0,
                                vatCode: line.vatCode.trim(),
                                vatDescription: !_this.isFinancialAccountLine(line) ? vatAccount.name : null,
                                ratePercentage: !_this.isFinancialAccountLine(line) ? vatAccount.ratePercentage : null,
                            };
                            dayGroup.vatGroups.push(vatGroup);
                            dayGroup.vatGroups = dayGroup.vatGroups.sort(function (vatGroup1, vatGroup2) {
                                return vatGroup1.vatCode > vatGroup2.vatCode
                                    ? 1
                                    : (vatGroup1.vatCode < vatGroup2.vatCode ? -1 : 0);
                            });
                        }
                    }
                }
                else {
                    dayGroup = {
                        day: line.date,
                        description: 'Incasso del giorno',
                        total: _this.isFinancialAccountLine(line) ? line.amount : 0,
                        vatGroups: !_this.isFinancialAccountLine(line)
                            ? [
                                {
                                    amount: _this.isAmountLine(line) ? -line.amount : 0,
                                    total: -line.amount,
                                    vat: _this.isVatLine(line) ? -line.amount : 0,
                                    vatCode: line.vatCode.trim(),
                                    vatDescription: !_this.isFinancialAccountLine(line) ? vatAccount.name : null,
                                    ratePercentage: !_this.isFinancialAccountLine(line) ? vatAccount.ratePercentage : null,
                                }
                            ]
                            : []
                    };
                    numberSeriesGroup.dailyRegistrations.push(dayGroup);
                }
            }
            else {
                numberSeriesGroup = {
                    numberSeriesPrefix: line.numberSeries.prefix,
                    numberSeriesName: numberSeries != null ? numberSeries.name : null,
                    dailyRegistrations: [
                        {
                            day: line.date,
                            description: 'Incasso del giorno',
                            total: _this.isFinancialAccountLine(line) ? line.amount : 0,
                            vatGroups: !_this.isFinancialAccountLine(line)
                                ? [
                                    {
                                        amount: _this.isAmountLine(line) ? -line.amount : 0,
                                        total: -line.amount,
                                        vat: _this.isVatLine(line) ? -line.amount : 0,
                                        vatCode: line.vatCode.trim(),
                                        vatDescription: !_this.isFinancialAccountLine(line) ? vatAccount.name : null,
                                        ratePercentage: !_this.isFinancialAccountLine(line) ? vatAccount.ratePercentage : null,
                                    }
                                ]
                                : []
                        }
                    ]
                };
                groups.push(numberSeriesGroup);
            }
            return groups;
        }, []);
    };
    DataTransformer.prototype.getSummary = function (reportPages) {
        var rows = reportPages
            .filter(function (page) { return page.summary != null; })
            .reduce(function (group, currentPage) {
            currentPage.summary.forEach(function (vatGroup) {
                var summaryGroup = group.find(function (item) { return item.vatCode == vatGroup.vatCode; });
                if (summaryGroup) {
                    summaryGroup.amount += vatGroup.amount;
                    summaryGroup.vat += vatGroup.vat;
                    summaryGroup.total += vatGroup.total;
                }
                else {
                    summaryGroup = {
                        vatCode: vatGroup.vatCode,
                        vatDescription: vatGroup.vatDescription,
                        ratePercentage: vatGroup.ratePercentage,
                        amount: vatGroup.amount,
                        vat: vatGroup.vat,
                        total: vatGroup.total
                    };
                    group.push(summaryGroup);
                }
            });
            return group;
        }, [])
            .sort(function (vatGroup1, vatGroup2) {
            return vatGroup1.vatCode > vatGroup2.vatCode
                ? 1
                : (vatGroup1.vatCode < vatGroup2.vatCode ? -1 : 0);
        });
        var totals = rows.reduce(function (totals, row) {
            totals.amount += row.amount;
            totals.vat += row.vat;
            totals.total += row.total;
            return totals;
        }, { amount: 0, vat: 0, total: 0 });
        return {
            rows: rows,
            totals: totals
        };
    };
    DataTransformer.prototype.getPeriod = function (filter) {
        var year = filter.year;
        switch (filter.period) {
            case period_enum_1.PeriodEnum.January:
            case period_enum_1.PeriodEnum.February:
            case period_enum_1.PeriodEnum.March:
            case period_enum_1.PeriodEnum.April:
            case period_enum_1.PeriodEnum.May:
            case period_enum_1.PeriodEnum.June:
            case period_enum_1.PeriodEnum.July:
            case period_enum_1.PeriodEnum.August:
            case period_enum_1.PeriodEnum.September:
            case period_enum_1.PeriodEnum.October:
            case period_enum_1.PeriodEnum.November:
            case period_enum_1.PeriodEnum.December:
                return this.getMonthName(filter.period - 1) + " - " + year;
            case period_enum_1.PeriodEnum.FirstQuarter:
                return "T1 - Primo trimestre - " + year;
            case period_enum_1.PeriodEnum.SecondQuarter:
                return "T2 - Secondo trimestre - " + year;
            case period_enum_1.PeriodEnum.ThirdQuarter:
                return "T3 - Terzo trimestre - " + year;
            case period_enum_1.PeriodEnum.FourthQuarter:
                return "T4 - Quarto trimestre - " + year;
            case period_enum_1.PeriodEnum.Yearly:
                return "Annuale - " + year;
            default:
                break;
        }
    };
    DataTransformer.prototype.getMonthName = function (monthNumber) {
        var monthNames = [
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
    };
    DataTransformer.prototype.isFinancialAccountLine = function (entryLine) {
        return entryLine.vatCode == null;
    };
    DataTransformer.prototype.isVatLine = function (entryLine) {
        return entryLine.vatLine;
    };
    DataTransformer.prototype.isAmountLine = function (entryLine) {
        return entryLine.vatCode && !entryLine.vatLine;
    };
    DataTransformer.prototype.getPagedData = function (groupedData) {
        var _this = this;
        var pages = [];
        var _loop_1 = function (index) {
            var numberSeriesGroup = groupedData[index];
            var numberSeriesPages = numberSeriesGroup.dailyRegistrations.reduce(function (pages, dailyGroup, index) {
                var lastPage = pages.find(function (page) { return page.numberSeriesPrefix == numberSeriesGroup.numberSeriesPrefix &&
                    page.rows.length < _this._maxRowsPerPage; });
                var currentPage;
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
                dailyGroup.vatGroups.forEach(function (vatGroup) {
                    if (currentPage.rows == _this._maxRowsPerPage) {
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
            this_1.createNumberSeriesSummary(numberSeriesPages);
            pages = pages.concat(numberSeriesPages);
        };
        var this_1 = this;
        for (var index = 0; index < groupedData.length; index++) {
            _loop_1(index);
        }
        return pages;
    };
    DataTransformer.prototype.createNumberSeriesSummary = function (numberSeriesPages) {
        var summary = numberSeriesPages.reduce(function (numberSeriesSummary, page) {
            var pageSummary = page.rows.reduce(function (pageSummary, pageRow, index) {
                if (!pageRow.vatCode) {
                    return pageSummary;
                }
                var vatGroup = pageSummary.find(function (group) { return group.vatCode == pageRow.vatCode; });
                if (vatGroup == null) {
                    vatGroup = {
                        vatCode: pageRow.vatCode,
                        vatDescription: pageRow.vatDescription,
                        ratePercentage: pageRow.ratePercentage,
                        amount: pageRow.amount,
                        vat: pageRow.vat,
                        total: pageRow.total
                    };
                    pageSummary.push(vatGroup);
                }
                else {
                    vatGroup.amount += pageRow.amount;
                    vatGroup.vat += pageRow.vat;
                    vatGroup.total += pageRow.total;
                }
                return pageSummary;
            }, []);
            pageSummary.forEach(function (pageVatGroup) {
                var numberSeriesVatGroup = numberSeriesSummary.find(function (vatGroup) { return vatGroup.vatCode == pageVatGroup.vatCode; });
                if (numberSeriesVatGroup == null) {
                    numberSeriesVatGroup = {
                        vatCode: pageVatGroup.vatCode,
                        vatDescription: pageVatGroup.vatDescription,
                        ratePercentage: pageVatGroup.ratePercentage,
                        amount: pageVatGroup.amount,
                        vat: pageVatGroup.vat,
                        total: pageVatGroup.total
                    };
                    numberSeriesSummary.push(numberSeriesVatGroup);
                }
                else {
                    numberSeriesVatGroup.amount += pageVatGroup.amount;
                    numberSeriesVatGroup.vat += pageVatGroup.vat;
                    numberSeriesVatGroup.total += pageVatGroup.total;
                }
            });
            return numberSeriesSummary.sort(function (vatGroup1, vatGroup2) {
                return vatGroup1.vatCode > vatGroup2.vatCode
                    ? 1
                    : (vatGroup1.vatCode < vatGroup2.vatCode
                        ? -1
                        : 0);
            });
        }, []);
        var lastPage = numberSeriesPages[numberSeriesPages.length - 1];
        var summaryTotals = this.getPageSummaryTotal(summary);
        if (this.pageHasEnoughSpace(lastPage, summary)) {
            lastPage.summary = summary;
            lastPage.summaryAmount = summaryTotals.amount;
            lastPage.summaryVat = summaryTotals.vat;
            lastPage.summaryTotal = summaryTotals.total;
        }
        else {
            numberSeriesPages.push({
                numberSeriesPrefix: lastPage.numberSeriesPrefix,
                summary: summary,
                summaryAmount: summaryTotals.amount,
                summaryVat: summaryTotals.vat,
                summaryTotal: summaryTotals.total,
            });
        }
    };
    DataTransformer.prototype.getPageSummaryTotal = function (pageSummary) {
        return pageSummary.reduce(function (sum, summaryRow) {
            sum.amount += summaryRow.amount;
            sum.vat += summaryRow.vat;
            sum.total += summaryRow.total;
            return sum;
        }, { amount: 0, vat: 0, total: 0 });
    };
    DataTransformer.prototype.pageHasEnoughSpace = function (page, rows) {
        return (this._maxRowsPerPage - page.rows.length) > rows.length;
    };
    return DataTransformer;
}());
exports.DataTransformer = DataTransformer;
//# sourceMappingURL=data-transformer.js.map