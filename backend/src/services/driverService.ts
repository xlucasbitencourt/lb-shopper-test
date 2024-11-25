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
