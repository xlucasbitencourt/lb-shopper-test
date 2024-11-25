import Customer from "../database/models/Customer";

export const showCustomers = async () => {
  return await Customer.findAll();
};

export const showById = async (id: number) => {
  return await Customer.findByPk(id);
};