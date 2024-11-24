import sequelize, { Model } from "sequelize";
import db from '.'

class Customer extends Model {
  declare customerId: number;
  declare name: string;
}

Customer.init({
  customerId: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize: db,
  tableName: 'customers',
  timestamps: false,
  underscored: true
});

export default Customer;