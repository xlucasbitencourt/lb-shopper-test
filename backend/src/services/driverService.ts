import Driver from "../database/models/Driver";
import { Op } from "sequelize";

export const showDriversAvailable = async (meters: number) => {
  const metersToKm = meters / 1000;
  const drivers = await Driver.findAll({
    where: {
      min_km: { [Op.lte]: metersToKm },
    },
  });
  
  return drivers;
};

export const getDriverByIdAndName = async (id: number, name: string) => {
  const driver = await Driver.findOne({
    where: {
      driver_id: id,
      name,
    },
  });

  return driver;
};
