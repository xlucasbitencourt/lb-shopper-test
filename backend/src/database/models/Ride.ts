import sequelize, { Model } from "sequelize";
import db from '.'

class Ride extends Model {
  declare rideId: number;
  declare customerId: number;
  declare driverId: number;
  declare startLat: number;
  declare startLng: number;
  declare endLat: number;
  declare endLng: number;
  declare distance: number;
  declare duration: number;
  declare value: number;
  declare date: Date;
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
  startLat: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  startLng: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  endLat: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  endLng: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  distance: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  duration: {
    type: sequelize.INTEGER,
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

Ride.belongsTo(db.models.Customer, { foreignKey: 'customerId' });
Ride.belongsTo(db.models.Driver, { foreignKey: 'driverId' });

export default Ride;