import { DialogResultValueEnum } from './dialog-result-value.enum';

export interface IDialogResult<T> {
    name: string;
    result: DialogResultValueEnum;
    data: T;
}
