import type DatabaseConnection from "../database/DatabaseConnection.ts";

export default class ORM {

    constructor (readonly databaseConnection: DatabaseConnection) {
    }
    
    async save (model: Model) {
        const columns = model.columns.map((column) => column.column).join(",");
        const params = model.columns.map((column, index) => `$${index + 1}`).join(",");
        const values = model.columns.map((column) => model[column.property]);
        const query = `insert into ${model.schema}.${model.table} (${columns}) values (${params})`;
        await this.databaseConnection.query(query, values);
    }

    async update (model: Model) {
        const columns = model.columns.filter((column) => !column.pk).map((column, index) => `${column.column} = $${index + 1}`).join(",");
        const values = model.columns.filter((column) => !column.pk).map((column) => model[column.property]);
        const [pkColumn] = model.columns.filter((column) => column.pk).map((column) => column.column);
        const [pkProperty] = model.columns.filter((column) => column.pk).map((column) => column.property);
        const pkParam = `$${values.length + 1}`;
        const pkValue = model[pkProperty!];
        const query = `update ${model.schema}.${model.table} set ${columns} where ${pkColumn} = ${pkParam}`;
        await this.databaseConnection.query(query, [...values, pkValue]);
    }

    async get (model: any, column: string, value: string) {
        const query = `select * from ${model.prototype.schema}.${model.prototype.table} where ${column} = $1`;
        const [data] = await this.databaseConnection.query(query, [value]);
        const output = new model();
        for (const column of model.prototype.columns) {
            output[column.property] = data[column.column];
        }
        return output;
    }
}

export class Model {
    declare schema: string;
    declare table: string;
    declare columns: { column: string, property: string, pk: boolean }[];
    [property: string]: any;
}

export function model (options: any) {
    return function (target: any) {
        target.prototype.schema = options.schema;
        target.prototype.table = options.table;
    }
}

export function column (options: any) {
    return function (target: any, propertyKey: string) {
        target.columns = target.columns || [];
        target.columns.push({ column: options.name, property: propertyKey, pk: !!options.pk });
    }
}