import { PeriodEnum } from "../../shared/period-enum";
import { IRevisoNumberSeries } from "../../shared/reviso-number-series";

export interface IFilter {
    year: number;
    period: PeriodEnum;
    numberSeries: Array<IRevisoNumberSeries>
    includeDraftEntries: boolean;
}