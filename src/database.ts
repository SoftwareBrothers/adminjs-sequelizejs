import { BaseDatabase, BaseResource } from 'adminjs';
import { Sequelize } from 'sequelize';

import Resource from './resource.js';

class Database extends BaseDatabase {
  private sequelize: Sequelize;

  static isAdapterFor(database: any): boolean {
    return (database.sequelize
      && database.sequelize.constructor.name === 'Sequelize')
      || database.constructor.name === 'Sequelize';
  }

  constructor(database: any) {
    super(database);
    this.sequelize = database.sequelize || database;
  }

  resources(): Array<BaseResource> {
    return Object.keys(this.sequelize.models).map((key) => (
      new Resource(this.sequelize.models[key])
    ));
  }
}

export default Database;
