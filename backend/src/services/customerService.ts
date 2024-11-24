import { ModelStatic } from "sequelize";
import Customer from "../database/models/Customer";

export const showCustomers = async () => {
  return await Customer.findAll();
};