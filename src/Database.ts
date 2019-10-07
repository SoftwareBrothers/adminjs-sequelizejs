const {BaseDatabase} = require("admin-bro");
const Resource = require("./Resource");

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
            new Resource(this.sequelize.models[key])
        ));
    }

    public static isAdapterFor(database)
    {
        // TODO: isAdapterFor TypeORM
        return (database.sequelize
            && database.sequelize.constructor.name === "Sequelize")
            || database.constructor.name === "Sequelize";
    }
}
