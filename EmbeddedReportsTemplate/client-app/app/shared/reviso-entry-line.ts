import { IRevisoNumberSeries } from "./reviso-number-series";


export interface IRevisoEntryLine {
    accountNumber: number,
    amount: number,
    amountForeignCurrency: number,
    booked: boolean,
    currency: string,
    date: string,
    entryType: string,
    entryTypeId: number,
    numberSeries: IRevisoNumberSeries,
    splitPaymentType: string,
    vatCode?: string,
    vatLine?: boolean,
    vatRate?: number,
    voucherNumber: string,
}