
export interface IVatGroupItem {
    vatCode: string;
    vatDescription: string,
    ratePercentage: number,
    amount: number;
    vat: number;
    total: number;
}

export interface IDailyRegistrationItem {
    day: string;
    description: string;
    total: number;
    vatGroups: Array<IVatGroupItem>;
}

export interface ICorrispettiviContent {
    numberSeriesPrefix: string;
    numberSeriesName: string;
    dailyRegistrations: Array<IDailyRegistrationItem>;
}