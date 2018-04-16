
export interface IDataTransformer {
    transform(source: any, filter: any): Array<any>;
}