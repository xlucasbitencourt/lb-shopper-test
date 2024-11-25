import sequelize, { Model } from "sequelize";
import db from '.'

class Ride extends Model {
  declare rideId: number;
  declare customerId: number;
  declare driverId: number;
  declare origin: string;
  declare destination: string;
  declare distance: number;
  declare duration: number;
  declare value: number;
  declare date: Date;
  declare driver: {
    driverId: number;
    name: string;
  }
}

Ride.init({
  rideId: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  customerId: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  driverId: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  origin: {
    type: sequelize.STRING,
    allowNull: false
  },
  destination: {
    type: sequelize.STRING,
    allowNull: false
  },
  distance: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  duration: {
    type: sequelize.STRING,
    allowNull: false
  },
  value: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  date: {
    type: sequelize.DATE,
    allowNull: false
  }
}, {
  sequelize: db,
  tableName: 'rides',
  timestamps: false,
  underscored: true
});

Ride.belongsTo(db.models.Customer, { foreignKey: 'customerId', as: 'customer' });
Ride.belongsTo(db.models.Driver, { foreignKey: 'driverId', as: 'driver' });

export default Ride;