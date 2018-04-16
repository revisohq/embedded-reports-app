import { Subject } from "rxjs/Subject";

export interface ReportBaseComponent {
    clearFilter(): void;
    filter: any;
    name: string;
    print(): void;
    title: string;
}