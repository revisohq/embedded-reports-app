export interface IPagination {
    firstPage: string;
    lastPage: string;
    maxPageSizeAllowed: number;
    nextPage: string;
    pageSize: number;
    results: number;
    resultsWithoutFilter: number;
    skipPages: number;
}

export interface IRevisoCollectionResponseMessage<T> {
    collection: Array<T>;
    pagination: IPagination;
}

export interface IRevisoReportResponseMessage<T> {
    lines: Array<T>;
    fromDate: string;
    toDate: string;
}