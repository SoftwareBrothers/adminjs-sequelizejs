import {Property} from "./Property";
const convertFilter = require("./utils/convertFilter");
const {
    BaseResource,
    BaseRecord,
    ValidationError,
} = require("admin-bro");

export const SEQUELIZE_VALIDATION_ERROR = "SequelizeValidationError";

export class Resource extends BaseResource
{
    constructor(SequelizeModel)
    {
        super(SequelizeModel);
        this.SequelizeModel = SequelizeModel;
    }

    public rawAttributes()
    {
        // different sequelize versions stores attributes in different places
        // .rawAttributes => sequelize ^5.0.0
        // .attributes => sequelize ^4.0.0
        return this.SequelizeModel.attributes || this.SequelizeModel.rawAttributes;
    }

    public databaseName()
    {
        return this.SequelizeModel.sequelize.options.database
            || this.SequelizeModel.sequelize.options.host;
    }

    public databaseType()
    {
        return this.SequelizeModel.sequelize.options.dialect;
    }

    public name()
    {
        return this.SequelizeModel.tableName;
    }

    public id()
    {
        return this.SequelizeModel.tableName;
    }

    public properties()
    {
        return Object.keys(this.rawAttributes()).map(key => (
            new Property(this.rawAttributes()[key])
        ));
    }

    public property(path)
    {
        return new Property(this.rawAttributes()[path]);
    }

    public async count(filter)
    {
        return this.SequelizeModel.count(({
            where: convertFilter(filter),
        }));
    }

    public async populate(baseRecords, property)
    {
        const ids = baseRecords.map(baseRecord => (
            baseRecord.param(property.name())
        ));
        const records = await this.SequelizeModel.findAll({where: {id: ids}});
        const recordsHash = records.reduce((memo, record) =>
        {
            memo[record.id] = record;
            return memo;
        }, {});
        baseRecords.forEach((baseRecord) =>
        {
            const id = baseRecord.param(property.name());
            if(recordsHash[id])
            {
                const referenceRecord = new BaseRecord(
                    recordsHash[id].toJSON(), this,
                );
                baseRecord.populated[property.name()] = referenceRecord;
            }
        });
        return true;
    }

    public async find(filter, {limit = 20, offset = 0, sort = {}})
    {
        const {direction, sortBy} = sort as any;
        const sequelizeObjects = await this.SequelizeModel
            .findAll({
                where: convertFilter(filter),
                limit,
                offset,
                order: [[sortBy, (direction || "asc").toUpperCase()]],
            });
        return sequelizeObjects.map(sequelizeObject => new BaseRecord(sequelizeObject.toJSON(), this));
    }

    public async findOne(id)
    {
        const sequelizeObject = await this.findById(id);
        return new BaseRecord(sequelizeObject.toJSON(), this);
    }

    public async findById(id)
    {
        // versions of Sequelize before 5 had findById method - after that there was findByPk
        const method = this.SequelizeModel.findByPk ? "findByPk" : "findById";
        return this.SequelizeModel[method](id);
    }

    public async create(params)
    {
        try
        {
            const record = await this.SequelizeModel.create(params);
            return record.toJSON();
        }
        catch(error)
        {
            if(error.name === SEQUELIZE_VALIDATION_ERROR)
            {
                throw this.createValidationError(error);
            }
            throw error;
        }
    }

    public async update(id, params)
    {
        try
        {
            await this.SequelizeModel.update(params, {
                where: {id},
            });
            const record = await this.findById(id);
            return record.toJSON();
        }
        catch(error)
        {
            if(error.name === SEQUELIZE_VALIDATION_ERROR)
            {
                throw this.createValidationError(error);
            }
            throw error;
        }
    }

    public async delete(id)
    {
        return this.SequelizeModel.destroy({where: {id}});
    }

    public createValidationError(originalError)
    {
        const errors = Object.keys(originalError.errors).reduce((memo, key) =>
        {
            const {path, message, validatorKey} = originalError.errors[key];
            memo[path] = {message, kind: validatorKey}; // eslint-disable-line no-param-reassign
            return memo;
        }, {});
        return new ValidationError(`${this.name()} validation failed`, errors);
    }

    public static isAdapterFor(rawResource)
    {
        return rawResource.sequelize && rawResource.sequelize.constructor.name === "Sequelize";
    }
}
