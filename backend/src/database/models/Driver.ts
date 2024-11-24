import sequelize, { Model } from "sequelize";
import db from '.'

class Driver extends Model {
  declare driverId: number;
  declare name: string;
  declare desciption: string;
  declare vehicle: string;
  declare rating: number;
  declare avaliation: string;
  declare fare: number;
  declare minKm: number;
}

Driver.init({
  driverId: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: sequelize.STRING,
    allowNull: false
  },
  description: {
    type: sequelize.STRING,
    allowNull: false
  },
  vehicle: {
    type: sequelize.STRING,
    allowNull: false
  },
  rating: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  avaliation: {
    type: sequelize.STRING,
    allowNull: false
  },
  fare: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  minKm: {
    type: sequelize.FLOAT,
    allowNull: false
  }
}, {
  sequelize: db,
  tableName: 'drivers',
  timestamps: false,
  underscored: true
});

export default Driver;