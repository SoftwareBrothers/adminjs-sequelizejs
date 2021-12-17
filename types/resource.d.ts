import { BaseResource, BaseRecord, BaseProperty, Filter } from 'adminjs';
import { Model, ModelAttributeColumnOptions } from 'sequelize/types';
declare type Constructor<T> = new (...args: any[]) => T;
export declare type ModelType<T extends Model<T>> = Constructor<T> & typeof Model;
declare type FindOptions = {
    limit?: number;
    offset?: number;
    sort?: {
        sortBy?: string;
        direction?: 'asc' | 'desc';
    };
};
declare class Resource extends BaseResource {
    private SequelizeModel;
    static isAdapterFor(rawResource: any): boolean;
    constructor(SequelizeModel: typeof Model);
    rawAttributes(): Record<string, ModelAttributeColumnOptions>;
    databaseName(): string;
    databaseType(): string;
    name(): string;
    id(): string;
    properties(): Array<BaseProperty>;
    property(path: string): BaseProperty | null;
    count(filter: Filter): Promise<number>;
    primaryKey(): string;
    populate(baseRecords: any, property: any): Promise<Array<BaseRecord>>;
    find(filter: any, { limit, offset, sort }: FindOptions): any;
    findOne(id: any): Promise<BaseRecord | null>;
    findMany(ids: any): Promise<BaseRecord[]>;
    findById(id: any): Promise<any>;
    create(params: any): Promise<Record<string, any>>;
    update(id: any, params: any): Promise<any>;
    delete(id: any): Promise<void>;
    /**
     * Check all params against values they hold. In case of wrong value it corrects it.
     *
     * What it does exactly:
     * - removes keys with empty strings for the `number`, `float` and 'reference' properties.
     *
     * @param   {Object}  params  received from AdminJS form
     *
     * @return  {Object}          converted params
     */
    parseParams(params: any): any;
}
export default Resource;
