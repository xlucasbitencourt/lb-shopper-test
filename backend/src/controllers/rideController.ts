import { Application, Request, Response } from "express";
import { showById } from "../services/customerService";
import { getEstimateDrivers } from "../services/rideService";

export const estimateRide = async (req: Request, res: Response): Promise<any> => {
  const { origin, destination, customer_id } = req.body;
  try {
    if (!origin || !destination || !customer_id) {
      return res.status(400).send({
        error_code: "INVALID_DATA",
        error_description:
          "Os campos origin, destination e customer_id devem ser preenchidos.",
      });
    }
    if (typeof origin !== "string" || typeof destination !== "string") {
      return res.status(400).send({
        error_code: "INVALID_DATA",
        error_description: "Os campos origin e destination devem ser do tipo string.",
      });
    }
    if (origin === destination) {
      return res.status(400).send({
        error_code: "INVALID_DATA",
        error_description: "Os campos origin e destination não podem ser iguais.",
      });
    }
    const customer = await showById(customer_id);
    if (!customer) {
      return res.status(400).send({
        error_code: "INVALID_DATA",
        error_description: "Cliente não encontrado.",
      });
    }
    const route = await getEstimateDrivers({ origin, destination });
    if (route === 404) {
      return res.status(404).send({
        error_code: "DRIVERS_NOT_FOUND",
        error_description: "Não há motoristas disponíveis para essa rota.",
      });
    }
    return res.status(200).send({ route });
  } catch (error: any) {
    res.send({ message: (error as Error).message });
  }
};
