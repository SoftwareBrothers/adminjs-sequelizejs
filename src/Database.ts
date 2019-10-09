import { Resource } from "./Resource";

const { BaseDatabase } = require("admin-bro");

export class Database extends BaseDatabase
{
    public sequelize: any;

    public constructor(database)
    {
        super();
        this.sequelize = database.sequelize || database;
    }

    public resources()
    {
        return Object.keys(this.sequelize.models).map(key => (
            new Resource(this.sequelize.models[ key ])
        ));
    }

    public static isAdapterFor(database)
    {
        return true;
    }
}
